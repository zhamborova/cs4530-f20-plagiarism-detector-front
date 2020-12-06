#include "same_header.c"


// read the next line from the src file into inbuff
void getLine() 
{
  ++ linenum;

  inptr = 0;

  char temp = getc( fileIn);
  inbuff[ inptr] = temp;

  // read in the next line
  while (temp != '\n' && temp != EOF && temp != '\0') 
  {
    temp = getc( fileIn);
    ++ inptr;
    inbuff[ inptr] = temp;
  } // end while

  ++ inptr;
  inbuff[ inptr] = '\n';

  linelen = inptr;

  if (inptr == 1) // empty line has a length of 0
    linelen = 0;

  inptr = 0;

  ch = temp; // last char read in
} // end getLine

// gets the next character from the input buffer
void nextchar() 
{

  if (inptr >= linelen)  // should be true on startup 
  {
              
    if (ch == EOF) 
    {
      //printf("EOF encountered, program incomplete");
      return;
    } // end EOF check if
    getLine();
  } // end inptr check if

  ch = inbuff[ inptr];
  ++ inptr; // move inptr to point to the next char in the input buffer
} // end nextchar

// skip separators at the beginning of the line
// recall separators are whitespace, \n, \t, \r
void skipsep() 
{
  while (inSeparators( ch)) 
  {
    nextchar();
  }
}

// build identifier
// this method is called when it's already an ident 
// so, char (char | dig)*
void bldident() 
{

  // clear old ident
  int k;
  for ( k = 0; k < idbuffsize; ++ k)
    idbuff[ k] = '\0';

  k = 0; // number of chars in the ident

  do // read in chars into ident while they're numbers or letters 
  { 
    if (k < idbuffsize) 
    {
      idbuff[ k] = ch;
      ++ k;
    } // end if
    nextchar();
  } while (( inDigits(ch) || inLetters(ch)));

  if (k >= idlen)
    idlen = k;
  else                       // new ident shorter than old ident so rewrite end of buffer
  { 
    do 
    {
      idbuff[ idlen] = '\0'; // write blanks over leftover chars
      -- idlen;
    } while (idlen != k);
  }  // end else

  // don't convert to lowercase b/c Oberon is case sensitive!!!

} // end bldident

// compare 2 strings 
int strcmp( const char *a, const char *b) 
{
  // we're going with a is uppercase
  // and b is lowercase
  int i;
  for( i = 0; a[ i] != '\0' && b[ i] != '\0';) 
  {
    if( a[ i] != b[ i]  && a[ i] != '\0' && b[ i] != '\0')
      return 1; // not same
    ++i;
    if( ( a[ i] == '\0' && b[ i] != '\0') || ( b[ i] == '\0' && a[ i] != '\0'))
      return 1; // not same
  } // end for

  return 0; // equal word
} // end strcmp

// build ident and figure out if it's a reserved word or just normal ident
void scanident() 
{
  // ident -> letter { [ underscore ] ( letter | digit ) }
  // letter -> 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j'
  //                | 'k' | 'l' | 'm' | 'n' | 'o' | 'p' | 'q' | 'r' | 's' 
  //                | 't' | 'u' | 'v' | 'w' | 'x' | 'y' | 'z'

  bldident();
  bool isResWrd = false;

  int i;
  for ( i = 0; i < nreswrd && !isResWrd; ++ i) // linear search of reswords
  { 
    if (strcmp( reswrd[ i][ 0], idbuff) == 0) 
    {
      isResWrd = true;
      // since i is updated at the end of the loop
      // decrement here since when ++i will get to actual value
      -- i;
    }
  }

  if ( isResWrd)
    sym = reswrdsym[ i];
  else
    sym = ident;
} // end scanident


// hex number is stored in a buffer
// this takes the current int and puts it in the hex buffer
// mostly for hex numbers starting with ints which were initially read 
// into ints
int rebuffHex( int dec) // returns index to keep adding to
{ 
  int i, j;
  char temp[ 256];
  // empty buffer
  for( i = 0; i < 256; ++ i) 
  {
    hexBuff[ i] = '\0';
    temp[ i] = '\0';
  }

  i = 0;
  do                // go digit per digit and store in hex buffer
  {   
    int curDig = dec%10;
    temp[ i] = (char) (curDig + (int)('0'));

    dec = dec/10;
    ++i;
  } while( dec != 0);

  // now need to reverse the array
  for( j = i - 1; j >= 0; -- j) 
    hexBuff[ (i - 1) - j] = temp[ j];

  return i;
} // end rebuffHex

// computes basse to the power of exp
// where exp is a positive integer
float expo(float base, int exp) 
{
  float res = 1;
  int i;
  for ( i = 0; i < exp; ++ i)
    res *= base;
  return res;
} // end expo

int getValue() // return value of current hex in decimal
{
  int i = 255; // last index of char
  int curPow = 0;
  int totalVal = 0;
  
  while ( i >= 0)
  {
  	if ( hexBuff[ i] != '\0')
  	{
      int curDig = 0;
  	  char curChar = hexBuff[ i];

  	  if ( inUppercase( curChar))        // then it's an uppercase letter from A to F inclusive
  	  	curDig = 10 + (int) ( curChar - 'A');
  	  else                               // then it's a number
  	    curDig = (int) ( curChar - '0');

  	  totalVal += curDig * expo( 16, curPow);
  	  ++ curPow;
  	}
  	-- i;
  }
  return totalVal;
}

// scan a number (int/hex/real)
void scannum() 
{
  sym = int_number;

  int digval;

  intval = 0;

  while( ch == '0') // ignore leading zeroes
    nextchar();
  while( inDigits( ch)) 
  {
    digval = (int) (ch - '0');

    intval = 10*intval + digval;
    nextchar();
  } // end while

  if ( ch == '.') 
  {
    // look at next char but don't actually process it
    if ( inptr >= linelen) 
    {
      // then . was the last char on the line and it's broken
      error( 10);
      return;
    }
    // ok, then the . wasn't the last char
    // the next char is inbuff[ inptr]
    char lookahead = inbuff[ inptr];
    if( lookahead == '.') 
    {
      // then it's a range
      return;
    } 
    else if( inDigits( lookahead)) 
    {
      numdigs = 0; 
      decimals = 0;
      sym = real_number;
      nextchar(); // to eat the .
      while( inDigits( ch)) 
      {
        digval = (int) (ch - '0');

        decimals = 10*decimals + digval;
        ++ numdigs;
        nextchar();
      }  // end while
    } 
    else if( inSeparators( lookahead)) // assume num. is num.0
    { 
      numdigs = 0;
      decimals = 0;
      sym = real_number;
      nextchar();
    }
    else 
    {
      error( 10); // error in number format
    }
  } // end if for lookahead being a digit
  else if( inHexDigits( ch)) 
  {
    sym = hexint_number;
    // hex numbers are dig dig* hex hex* H
    // works b/c decimals digs count as hex

    // first convert the int you have from hex to dec, since we're storing in dec
    // actually i take it back, let's store hex numbers as 
    // char arrays, then we can print them as hex for output
    int hexInd = rebuffHex( intval); 

    // then, hexInd stores the end of the current int so you can 
    // keep adding to the buffer
    while( inHexDigits( ch)) 
    {
      hexBuff[ hexInd] = ch;
      ++ hexInd;
      nextchar();
    }

    if ( ch == 'H')
      nextchar(); // get rid of the H
    else if ( ch == 'X') 
    {
      // it was a one-character literal specified by its ordinal number (number between 0 and 255 in hex)
      // need to check the range of the number
      int ord = getValue();
      if ( ord < 0 || ord > 255)
        error( 16); // error in hex
      sym = CHAR_SYM;

      strlength = 1;
      strbuff[ 0] = (char) ord;
      strbuff[ 1] = '\0';

      nextchar();

    }
    else 
      error( 16); // something wrong with the hex
    
  } 
  else if( ch == 'H') 
  {
    // then it was a hex number with no letter parts
    rebuffHex( intval);
    sym = hexint_number;
    nextchar();
  } 
  else if ( ch == 'X')
  {
  	// then, it was a one-character literal specified by its ordinal number (number between 0 and 255 in hex)
  	rebuffHex( intval);
  	// need to check the range of the number
  	int ord = getValue();
  	if ( ord < 0 || ord > 255)
      error( 16); // error in hex
  	sym = CHAR_SYM;

  	strlength = 1;
    strbuff[ 0] = (char) ord;
    strbuff[ 1] = '\0';

    nextchar();

  }

} // end scannum


// scan comments 
// they are effectively ignored i.e. not included in the parse output
void rcomment() 
{
  // comments in oberon are (* ..... *)
  // also there can be nested comments 

  // start this method when (*  already found
  char temp; // nextchar was already called so on first char in comment
  int clev = 0; // comment level 0 is first level
  while( true) 
  {
    temp = ch;
    nextchar();

    if (temp == '(' && ch == '*') 
    {
      ++ clev;
      nextchar();
    }
    if (temp == '*' && ch == ')') 
    {
      -- clev;
      if (clev < 0)
        break;
    }

    if( ch == EOF)  // uh oh
    { 
      error( 45);
      exit( 0);
    }
  }
  nextchar();
} // end rcomment

// check if assignment statement :=
void idassign() 
{
  sym = colon;
  nextchar();
  if ( ch == '=') 
  {
    sym = assign;
    nextchar();
  }
} // end idassign

// check if relational operator with 2 chars
// this will be >= or <=
void idrelop() { 
  sym = spsym[ ch];
  nextchar(); 
  if ( sym == lt && ch == '=') 
  {
    sym = lte;
    nextchar();
  }
  else if (sym == gt && ch == '=') 
  {
    sym = gte;
    nextchar();
  }
} // end idrelop

// method to print the current symbol 
// mostly for debugging
void writesym() 
{
  fputs( symname[ sym][ 0], stdout);

  switch( sym) 
  {
    case ident:
      fputs( ": ", stdout);
      fputs( idbuff, stdout);
      break;
    case CHAR_SYM:
    case string:
      fputs( ": ", stdout);
      fputs( strbuff, stdout);
      break;
    case int_number: 
      printf( ": %d", intval);
      break;
    case hexint_number: 
      fputs(": ", stdout);
      fputs( hexBuff, stdout);
      break;
    case real_number:
      printf( ": %f", (intval + decimals/(expo(10.0f, numdigs))));
      break;
    default:
      break;
  } // end switch
  
  fputs( "\n", stdout);
} // end writesym

// scan a string " char* "   or ' char* '
void scanstr() 
{
  strlength = 0;
  do 
  {
    do 
    {
      nextchar();
      char temp = ' ';

      if ( ch == '\\') 
      {
        temp = '\\';
        nextchar();
      }

      if ( ch == EOF) 
      {
        error( 50); // missing "" for the string
        exit( 0); // end the program
      }

      if ( temp == '\\') // don't get rid of actual metachars
      { 
        if ( ch == 't') 
          ch = '\t';
        else if ( ch == 'n')
          ch = '\n';
        else if ( ch == '\r')
          ch = '\r';
      }

      strbuff[ strlength] = ch;
      ++ strlength;

      if (temp == '\\' && ch == strToMatch) // not end of string
        ch = ' ';

    } while( ch != strToMatch);
    nextchar();
  } while( ch == strToMatch);

  strbuff[ --strlength] = '\0'; // null character to end the string
                  // also last char is not in the string (it's the quote)
  if (strlength == 1)
    sym = CHAR_SYM; // a single char is a char instead of a string
  else
    sym = string;
} // end scanstr

// scan the next symbol
void nextsym() 
{
  // continue until symbol found
  bool symfnd;
  do 
  {
    symfnd = true;
    skipsep();
    symptr = inptr;

    if (inLetters( ch)) // ident or reserved word
    { 
      scanident();
    }
    else 
    {
      if (inDigits( ch)) // number
        scannum();
      else 
      {
        switch( ch) 
        {
          case '"':
          	strToMatch = '"';
          	scanstr();
            break;
          case '\'': 
          	strToMatch = '\'';
            scanstr();
            break;
          case '.':
            sym = per;
            nextchar();
            if ( ch == '.') 
            {
              sym = doubledot;
              nextchar();
            }
            break;
          case ':':
            idassign();
            break;
          case '<': // fall through to case '>', both call relop
          case '>':
            idrelop();
            break;
          case '(': // check for comment
            nextchar();
            if ( ch != '*')
              sym = lparen;
            else // now we know it's a comment
            { 
              symfnd = false;
              nextchar();
              rcomment();
            }
            break;
          case EOF:
            sym = eof_sym;
            break;
          default: // then should be in one of the "special" chars (star, slash, etc.)
            sym = spsym[ ch];
            nextchar();
            break;
        } // end switch
      }   // end if
    }     // end do
  } while (!symfnd);
} // end nextsym


// run the code
int main( int argc, char **argv) 
{
   ch = ' ';
   InitCompile();

   // arg[1] is the first command line arg

   if ( argc != 2) 
   {
       fputs( "\nError exiting now\nUsage: ./a.out fileToScan\n\n", stdout);
       exit( 0);
   }
   
   fileIn = fopen( argv[ 1], "r");

   do 
   {
     nextsym();
     writesym();
    } while( sym != eof_sym); 

   return(0);
} // end main
