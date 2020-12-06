import File from './File';
const acorn = require("acorn");
const fs = require("fs");
const stable = require('stable');
const walk = require("acorn-walk");
const crypto = require('crypto');
const babylon = require('babylon');

export default class Parser {
  private fileNodes: Map<string, any[]>;
  private threshold: number;
  private nodeTypes: Map<string, any[]>;
  private keyMap: Map<string, any[]>;

  constructor(private files: File[]) {
    this.fileNodes = new Map();
    this.threshold = 30;
    this.nodeTypes = new Map();
    this.keyMap = new Map();
  }

  public getFiles(): File[] {
    return this.files;
  }

  public compareCodes() {
    const filePaths: string[] = [];
    this.files.forEach(function (path) {filePaths.push(path.getName())});

    for(var filePath of filePaths) {
        const trees: any[] = [];
        const ast = fs.readFileSync(filePath).toString();
        const astRoot = babylon.parse(ast, {
          allowReturnOutsideFunction: true,
          allowImportExportEverywhere: true,
          sourceType: "script",
          plugins: ['jsx', 'flow', 'doExpressions', 'objectRestSpread', 'decorators',
          'classProperties', 'exportExtensions', 'asyncGenerators', 'functionBind',
          'functionSent', 'dynamicImport']
        }).program;

        this.getNodesDFS(astRoot, filePath, false, trees);
        this.walkTree(astRoot, filePath);
        this.fileNodes.set(filePath, trees);
        //console.log(trees);
    }
    //console.log(this.keyMap.get("2jmj7l5rSw0yVb/vlWAYkK/YBwk=").length);

    //console.log(this.keyMap);
    this.analyze();
    
  }   

  private walkTree(node: any, filename: string) {
    var visit = (node: any) => {
      var nodes: any[] = [];
      this.getNodesDFS(node, filename, true, nodes);
      //console.log(nodes.length);
      if (nodes.length >= this.threshold) {
        this.insertNode(nodes);
      }
      
      this.getChildren(node).forEach((child: any) => {
        visit(child);
      });
    };
    this.getChildren(node).forEach((child: any) => {
      visit(child);
    });
  }

  // private walkTree(node: any, filename: string) {

  //   this.getChildren(node).forEach((child: any) => {
  //     this.walkTree(child, filename);
  //   });

  //   var nodes: any[] = [];
  //   this.getNodesDFS(node, filename, true, nodes);
  //   console.log(nodes.length);
  //   if (nodes.length >= this.threshold) {
  //     this.insertNode(nodes);
  //   }
  // }

  private insertNode(nodes: any[]) {
    var types = "";
    nodes.forEach(node => {
      types += node.type.toString();
    })
    //console.log(types);
    var key = crypto.createHash('sha1').update(types).digest('base64');

    nodes.forEach(node => {
      if (!node.occurrences.has(key)) node.occurrences.set(key, []);
      node.occurrences.get(key).push(nodes);
    });

    if (!this.keyMap.has(key)) this.keyMap.set(key, []);

    this.keyMap.get(key).push(nodes);
  }

  private getNodesDFS(root: any, filename: string, hasThreshold: boolean, nodes: any[]) {

    if(hasThreshold && nodes.length >= this.threshold) return;

    if (!root.filename) root.filename = filename;
    if (!root.occurrences) root.occurrences = new Map();

    nodes.push(root);
    this.getChildren(root).forEach((node: any) => {
      this.getNodesDFS(node, filename, hasThreshold, nodes)});
  }

  private getChildren(node: any): any[] {
    var children: any[] = [];

    // get keys whose values have children
    if (!this.nodeTypes.has(node.type)) {
        this.nodeTypes.set(node.type, Object.keys(node).filter((key: string) => {
            return key !== 'loc' && typeof node[key] === 'object';
          }))
    }

    this.nodeTypes.get(node.type).forEach((key: string) => {
      var childNode = node[key];

      if (childNode && childNode.type) {
        children.push(childNode);
      } else if (childNode instanceof Array && childNode.length > 0) {
        children = children.concat(childNode.filter(node => {return node && (node.type !== 'JSXText' || node.value.trim())}));
      }
    });

    return children;
  }

  private analyze() {
    var keys: String[] = [];

    for (let key of this.keyMap.keys()) {  
      if(this.keyMap.get(key).length >= 2) keys.push(key);
    } 

    //TODO
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
            
            //console.log(node);
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
    if(node.occurrences) {
      for (let key of node.occurrences.keys()) {
        //console.log("lalala2");
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
}