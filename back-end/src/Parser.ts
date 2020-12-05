import File from './File';
const acorn = require("acorn");
const fs = require("fs");
const stable = require('stable');
const walk = require("acorn-walk");
const crypto = require('crypto');

export default class Parser {
  private fileNodes: Map<string, any[]>;
  private threshold: number;
  private nodeTypes: Map<string, any[]>;
  private keyMap: Map<string, any[]>;

  constructor(private files: Set<File>) {
    this.fileNodes = new Map();
    this.threshold = 30;
    this.nodeTypes = new Map();
    this.keyMap = new Map();
  }

  public getFiles(): Set<File> {
    return this.files;
  }

  public compareCodes() {
    const filePaths: string[] = [];
    this.files.forEach(function (path) {filePaths.push(path.getName())});
    //const filePaths = this.files.map(file => file.getName())

    for(var filePath of filePaths) {

        const ast = fs.readFileSync(filePath).toString();
        const nodes: any[] = [];
        const trees: any[] = [];
        walk.simple(acorn.parse(ast, {locations:true}), {
            Function(node: any) {
              nodes.push(node);
            }
        })

        for(var node of nodes) {
            trees.concat(this.getAllNodesDFS(node, filePath, false));
            this.walkTree(node, filePath, (nodes: any[]) => this.insertNode(nodes));
        }

        this.fileNodes.set(filePath, trees);
    }
    this.analyze();
  }   

  private walkTree(node: any, filename: string, insrt: Function) {
    this.walkSubtrees(node, (node: any, parent: any, ancestors: any[]) => {
        var nodes = this.getAllNodesDFS(node, filename, true);
        if (nodes.length === this.threshold) {
            insrt(nodes);
        }
      });
  }

  private walkSubtrees(root: any, fn: Function) {
    var visit = (node: any, parent: any, ancestors: any[]) => {
      fn(node, parent, ancestors);
      ancestors = ancestors.concat(node);
      this.getChildren(node).forEach((child: any) => {
        visit(child, node, ancestors);
      });
    };
    this.getChildren(root).forEach((child: any) => {
      visit(child, null, []);
    });
  }

  private insertNode(nodes: any[]) {
    var key = this.getMapKey(nodes);
    nodes.forEach(node => {
      if (!node.occurrences) {
        node.occurrences = new Map();
      }
      if (!node.occurrences.has(key)) {
        node.occurrences.set(key, []);
      }
      node.occurrences.get(key).push(nodes);
    });

    if (!this.keyMap.has(key)) {
        this.keyMap.set(key, []);
    }
    this.keyMap.get(key).push(nodes);
  }

  private getMapKey(nodes: any[]): string {
    var key = nodes[0].type;
    var length = nodes.length;

    // Significantly faster than a map & join
    for (var i = 1; i < length; i++) {
    key += ':' + nodes[i].type;
    }

    // Prefer shorter key lengths (base64 < hex)
    return crypto.createHash('sha1').update(key).digest('base64');
  }

  private getAllNodesDFS(root: any, filename: string, hasThreshold: boolean): any[] {
    var res: any[] = [];

    var dfs = (node: any) => {
        if(hasThreshold && res.length >= this.threshold) return;
    
        if (!node.filename) {
            node.filename = filename;
        }
        res.push(node);
        this.getChildren(node).forEach(dfs);
    };

    dfs(root);

    return res.slice(0, this.threshold);
  }

  private getChildren(node: any): any[] {
    var res: any[] = [];
    if (!this.nodeTypes.has(node.type)) {
        this.nodeTypes.set(node.type, Object.keys(node).filter((key) => {
            return key !== 'loc' && typeof node[key] === 'object';
          }))
    }
    // Ignore null values, as well as JSText nodes incorrectly generated
    // by babylon that contain only newlines and spaces
    var filterIgnored = (nodes: any[]) => nodes.filter(node => {
      return node && (node.type !== 'JSXText' || node.value.trim());
    });

    this.nodeTypes.get(node.type).forEach((key) => {
      var val = node[key];

      if (val && val.type) {
        res.push(val);
      } else if (val instanceof Array) {
        res = res.concat(filterIgnored(val));
      }
    });
    return res;
  }

  private analyze() {
    var keys: String[] = [];

    for (let key of this.keyMap.keys()) {  
      if(this.keyMap.get(key).length >= 2) {
        keys.push(key)
      }
      
    } 
    var sortedKeys = stable(keys, (a: string, b: string) => {
        return this.keyMap.get(b).length - this.keyMap.get(a).length;
    });
    
    for (let key of sortedKeys) {
      if (!this.keyMap.get(key)) {
        continue;
      }

      let nodeArrays = this.keyMap.get(key).slice(0);
      
      this.omitOverlappingInstances(nodeArrays);

      // // groups will be of type Node[][][]
      let groups = [nodeArrays];
      
      for (let i = 0; i < groups.length; i++) {
        if (groups[i].length < 2) continue;
        //console.log(groups[i].length);
        var keyNodes: String[] = [];
        this.expand(groups[i]);
        //var keyNodes = groups[i].reduce((node1, node2) => node1.concat(node2));
        for(var nodes of groups[i]) {
          for (var node of nodes) {
            keyNodes.push(node.name || node.type)
          }
        }

        var id = crypto.createHash('sha1').update(keyNodes.join(",")).digest('hex');
        
        for(var nodes of groups[i]) {
          var filename = nodes[0].filename;
          var start = nodes[0].loc.start.line;
          var endStart = nodes[0].loc.start.line;
          var endFinal = nodes[0].loc.end.line;
          for(var node of nodes) {
            
            // console.log(node);
            //keyset.add(node.occurrences.keys());
            start = start < node.loc.start.line? start : node.loc.start.line;
            endStart = endStart > node.loc.start.line? endStart : node.loc.start.line;
            endFinal = endFinal > node.loc.end.line? endFinal : node.loc.end.line;
          }
          //console.log(keyset);
          var last = nodes[nodes.length - 1];
          var lastEnd = last.loc.end;
          if (lastEnd.line > endStart.line && !this.getChildren(last).length) {
            endStart = lastEnd;
          }
          var end = endFinal - endStart <= 2 ? endFinal : endStart;
          for(var file of this.files) {
            if(file.getName() === filename) {
              file.addSimilarity(id, start, end);
              
            }
          }
        }
        console.log('match')
        this.prune(groups[i]);
      }
    }
  }

  private omitOverlappingInstances(nodeArrays: any[]) {
    var set = new Set();

    var hasOverlap = (nodes: any[]) => {
      return nodes.some(node => set.has(node));
    };

    var addNodes = (nodes: any[]) => {
      nodes.forEach(node => set.add(node));
    };

    for (let i = 0; i < nodeArrays.length; i++) {
      if (hasOverlap(nodeArrays[i])) {
        nodeArrays.splice(i--, 1);
        continue;
      } else {
        addNodes(nodeArrays[i]);
      }
    }
  }

  private expand(nodeArrays: any[]) {
    var traversals2 = nodeArrays.map(nodes => {
        return this.fileNodes.get(nodes[0].filename);
    });
    
    
    var headPositions = nodeArrays.map((nodes, i) => {
      return traversals2[i].indexOf(nodes[0]);
    });
    //console.log(headPositions)

    var tailPositions = nodeArrays.map((nodes, i) => {
      var last = nodes[nodes.length - 1];
      return traversals2[i].indexOf(last);
    });
    //console.log(tailPositions)

    var incr = (pos: number) => pos + 1;
    var decr = (pos: number) => pos - 1;
    var getNode = (pos: number, i: number) => traversals2[i][pos];
    var alreadyIncluded = (nodes: any[]) => {
      return nodes.some(node => {
        return nodeArrays.some(array => array.indexOf(node) !== -1)
      });
    };

    var isComplete = (nodes: any[]) => {
      return (!this.typesMatch(nodes) || alreadyIncluded(nodes)) 
    };

    while (true) {
      headPositions = headPositions.map(decr);
      let nodes = headPositions.map(getNode);
      if (isComplete(nodes)) break;
      nodeArrays.forEach((array, i) => array.unshift(nodes[i]));
    }

    while (true) {
      tailPositions = tailPositions.map(incr);
      let nodes = tailPositions.map(getNode);
      if (isComplete(nodes)) break;
      nodeArrays.forEach((array, i) => array.push(nodes[i]));
    }
  }

  private typesMatch(nodes: any[]) {
    return nodes.every(node => node && node.type === nodes[0].type);
  }

  private prune(nodeArrays: any[]) {
    for (let i = 0; i < nodeArrays.length; i++) {
      let nodes = nodeArrays[i];
      for (let j = 0; j < nodes.length; j++) {
        this.removeNode(nodes[j]);
      }
    }
  }

  private removeNode(node: any) {

    for (let key of node.occurrences.keys()) {

      for (let i = 0; i < node.occurrences.get(key).length; i++) {
        if (!this.keyMap.get(key)) break;
        let index = this.keyMap.get(key).indexOf(node.occurrences.get(key)[i]);
        if (index > -1) {
            this.keyMap.get(key).splice(index, 1);
        }

        // Delete empty buckets
        if (!this.keyMap.get(key).length) {
            this.keyMap.delete(key);
        }
      }
      node.occurrences.delete(key);
    }
  }
}