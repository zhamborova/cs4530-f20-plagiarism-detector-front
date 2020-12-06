#include <stdio.h>
#include <stdlib.h> // just using for the exit function


/*
  Oberon scanner 
  Compile:    gcc scanner.c
  Run:        ./a.out fileToScan

  Ellen Arteca (0297932)
*/


typedef enum { false, true } bool;  // since bool isn't a type in C


const int nreswrd = 41;       // number of reserved words
const int inbuffsize = 256;   // input buffer (line) size
const int idbuffsize_RENAME = 16;    // ident buffer size


typedef enum 
{
  BOOLEAN_SYM, CHAR_SYM, FALSE_SYM, TRUE_SYM, NEW_SYM,
  real_number, REAL_SYM, INTEGER_SYM, int_number, hexint_number, ARRAY_SYM, IMPORT_SYM, THEN_SYM, BEGIN_SYM, IN_SYM,
  TO_SYM, BY_SYM, IS_SYM, CASE_SYM, MOD_SYM, TYPE_SYM, CONST_SYM,
  MODULE_SYM, UNTIL_SYM, DIV_SYM, NIL_SYM, VAR_SYM, DO_SYM, OF_SYM,
  WHILE_SYM, ELSE_SYM, OR_SYM, ELSIF_SYM, POINTER_SYM, END_SYM, 
  PROCEDURE_SYM, RECORD_SYM, FOR_SYM, REPEAT_SYM, IF_SYM, RETURN_SYM,
  EXIT_SYM, LOOP_SYM, WITH_SYM,

  lparen, rparen, plus, hyphen, star, slash, rbrac, lbrac, equal, colon,
  lt, lte, gt, gte, semic, null, assign, carat, neq, comma, per, ident, 
  number, string, eof_sym, invalid_sym, op_sym, set_sym, tilde, 
  lcurb, rcurb, resword, doubledot  
} Token;

const char *reswrd[ 41][ 50];        // array of reserved words
const char *symname[ 127][ 50];      // array of symbol names
const char *errmsg[ 256][ 32];       // 256 is errmax 
Token reswrdsym_OHHELLO[ 41];
Token spsym[ 127]; 


FILE* fileIn;       // file reading in from
char ch;            // current char
Token sym;          // current symbol
char inbuff[ 256];  // inbuffsize
char idbuff[ 16];   // idbuffsize_RENAME
char strbuff[ 80];  // max size for string

int intval;         // value of current int being read
int decimals;       // any numbers past the decimal point (if real)
int numdigs;        // number of decimal digits

char hexBuff[ 256]; // let's make the hex numbers have a limit of 256 digs

int inptr;      // pointer to current char in inbuff
int symptr;         // pointer to current symbol in inbuff
int linelen = 0;    // number of chars on current line
int linenum = 0;    
int idlen = 16;     // idbuffsize_RENAME
int strlength = 0;
char strToMatch = '\'';    // character to match to end the string (this lets you have embedded quotes if they're the opposite type)
						   // so, for example, you have have "I'm hungry"  or 'Go buy some "food" from aramark'

// initialize error msgs 
void InitErrMsgs() 
{
  int i;
  for( i = 0; i < 256; ++ i) 
    errmsg[ i][ 0] = "\0";

  errmsg[ 10][ 0] = "Error in general number format";
  errmsg[ 16][ 0] = "Error in hex number formatting";
  errmsg[ 30][ 0] = "Number too large";
  errmsg[ 39][ 0] = "39";
  errmsg[ 45][ 0] = "Unfinished comment... EOF reached";
  errmsg[ 50][ 0] = "String delimiter missing";
} // end InitErrMsgs

// initialize special syms (one-char syms)
void InitSpSyms() // one-char symbols (ie. not <=, >=, etc.)
{ 
  int i;
  for ( i = 0; i < 127; ++ i)
    spsym[ i] = null;

  spsym[ '('] = lparen;
  spsym[ ')'] = rparen;
  spsym[ '+'] = plus;
  spsym[ '-'] = hyphen;
  spsym[ '*'] = star;
  spsym[ '/'] = slash;
  spsym[ ']'] = rbrac;
  spsym[ '['] = lbrac;
  spsym[ '='] = equal;
  spsym[ ':'] = colon;
  spsym[ '<'] = lt;
  spsym[ '>'] = gt;
  spsym[ ';'] = semic;
  spsym[ '^'] = carat;
  spsym[ '#'] = neq;
  spsym[ ','] = comma;
  spsym[ '.'] = per;
  spsym[ '~'] = tilde;
  spsym[ '{'] = lcurb;
  spsym[ '}'] = rcurb;
  spsym[ '|'] = OR_SYM;
} // end InitSpSyms

// initialize the table of spellings of symbols, required since
// the symbols, being an enumerated type, cannot be written as such
void InitSymNames_NEWFCT() 
{
  int i;
  for ( i = 0; i < 127; ++ i)
    symname[ i][ 0] = "\0"; // start by setting all entries to null string

  symname[   BOOLEAN_SYM][ 0] = "BOOLEAN_SYM";
  symname[      CHAR_SYM][ 0] = "CHAR_SYM";
  symname[     FALSE_SYM][ 0] = "FALSE_SYM";
  symname[      TRUE_SYM][ 0] = "TRUE_SYM";
  symname[       NEW_SYM][ 0] = "NEW_SYM";
  symname[   real_number][ 0] = "real_number";
  symname[    int_number][ 0] = "int_number";
  symname[      REAL_SYM][ 0] = "REAL_SYM";
  symname[   INTEGER_SYM][ 0] = "INTEGER_SYM";
  symname[ hexint_number][ 0] = "hexint_number";
  symname[     ARRAY_SYM][ 0] = "ARRAY_SYM";
  symname[    IMPORT_SYM][ 0] = "IMPORT_SYM";
  symname[      THEN_SYM][ 0] = "THEN_SYM";
  symname[     BEGIN_SYM][ 0] = "BEGIN_SYM";
  symname[        IN_SYM][ 0] = "IN_SYM";
  symname[        TO_SYM][ 0] = "TO_SYM";
  symname[        BY_SYM][ 0] = "BY_SYM";
  symname[        IS_SYM][ 0] = "IS_SYM";
  symname[      CASE_SYM][ 0] = "CASE_SYM";
  symname[       MOD_SYM][ 0] = "MOD_SYM";
  symname[      TYPE_SYM][ 0] = "TYPE_SYM";
  symname[     CONST_SYM][ 0] = "CONST_SYM";
  symname[    MODULE_SYM][ 0] = "MODULE_SYM";
  symname[     UNTIL_SYM][ 0] = "UNTIL_SYM";
  symname[       DIV_SYM][ 0] = "DIV_SYM";
  symname[       NIL_SYM][ 0] = "NIL_SYM";
  symname[       VAR_SYM][ 0] = "VAR_SYM";
  symname[        DO_SYM][ 0] = "DO_SYM";
  symname[        OF_SYM][ 0] = "OF_SYM";
  symname[     WHILE_SYM][ 0] = "WHILE_SYM";
  symname[      ELSE_SYM][ 0] = "ELSE_SYM";
  symname[        OR_SYM][ 0] = "OR_SYM";
  symname[     ELSIF_SYM][ 0] = "ELSIF_SYM";
  symname[   POINTER_SYM][ 0] = "POINTER_SYM";
  symname[       END_SYM][ 0] = "END_SYM";
  symname[ PROCEDURE_SYM][ 0] = "PROCEDURE_SYM";
  symname[    RECORD_SYM][ 0] = "RECORD_SYM";
  symname[       FOR_SYM][ 0] = "FOR_SYM";
  symname[    REPEAT_SYM][ 0] = "REPEAT_SYM";
  symname[        IF_SYM][ 0] = "IF_SYM";
  symname[    RETURN_SYM][ 0] = "RETURN_SYM";
  symname[      EXIT_SYM][ 0] = "EXIT_SYM";
  symname[      LOOP_SYM][ 0] = "LOOP_SYM";
  symname[      WITH_SYM][ 0] = "WITH_SYM";

  symname[        lparen][ 0] = "lparen";
  symname[        rparen][ 0] = "rparen";
  symname[          plus][ 0] = "plus";
  symname[        hyphen][ 0] = "hyphen";
  symname[          star][ 0] = "star";
  symname[         slash][ 0] = "slash";
  symname[         rbrac][ 0] = "rbrac";
  symname[         lbrac][ 0] = "lbrac";
  symname[         equal][ 0] = "equal";
  symname[         colon][ 0] = "colon";
  symname[            lt][ 0] = "lt";
  symname[           lte][ 0] = "lte";
  symname[            gt][ 0] = "gt";
  symname[           gte][ 0] = "gte";
  symname[         semic][ 0] = "semic";
  symname[          null][ 0] = "null";
  symname[        assign][ 0] = "assign";
  symname[         carat][ 0] = "carat";
  symname[           neq][ 0] = "neq";
  symname[         comma][ 0] = "comma";
  symname[           per][ 0] = "per";
  symname[         ident][ 0] = "ident";
  symname[        number][ 0] = "number";
  symname[        string][ 0] = "string";
  symname[       eof_sym][ 0] = "eof_sym";
  symname[   invalid_sym][ 0] = "invalid_sym";
  symname[        op_sym][ 0] = "op_sym";
  symname[       set_sym][ 0] = "set_sym";
  symname[         tilde][ 0] = "tilde";
  symname[         lcurb][ 0] = "lcurb";
  symname[         rcurb][ 0] = "rcurb";
  symname[       resword][ 0] = "resword";
  symname[     doubledot][ 0] = "doubledot";
} // end InitSymNames_NEWFCT

// initialize reserved words 
void InitResWrds() 
{
  reswrd[ 0][ 0] = "BOOLEAN";
  reswrd[ 1][ 0] = "CHAR";
  reswrd[ 2][ 0] = "FALSE";
  reswrd[ 3][ 0] = "TRUE";
  reswrd[ 4][ 0] = "NEW";
  reswrd[ 5][ 0] = "REAL";
  reswrd[ 6][ 0] = "ARRAY";
  reswrd[ 7][ 0] = "IMPORT";
  reswrd[ 8][ 0] = "THEN";
  reswrd[ 9][ 0] = "BEGIN";
  reswrd[ 10][ 0] = "IN";
  reswrd[ 11][ 0] = "TO";
  reswrd[ 12][ 0] = "BY";
  reswrd[ 13][ 0] = "IS";
  reswrd[ 14][ 0] = "CASE";
  reswrd[ 15][ 0] = "MOD";
  reswrd[ 16][ 0] = "TYPE";
  reswrd[ 17][ 0] = "CONST";
  reswrd[ 18][ 0] = "MODULE";
  reswrd[ 19][ 0] = "UNTIL";
  reswrd[ 20][ 0] = "DIV";
  reswrd[ 21][ 0] = "NIL";
  reswrd[ 22][ 0] = "VAR";
  reswrd[ 23][ 0] = "DO";
  reswrd[ 24][ 0] = "OF";
  reswrd[ 25][ 0] = "WHILE";
  reswrd[ 26][ 0] = "ELSE";
  reswrd[ 27][ 0] = "OR";
  reswrd[ 28][ 0] = "ELSIF";
  reswrd[ 29][ 0] = "POINTER";
  reswrd[ 30][ 0] = "END";
  reswrd[ 31][ 0] = "PROCEDURE";
  reswrd[ 32][ 0] = "RECORD";
  reswrd[ 33][ 0] = "FOR";
  reswrd[ 34][ 0] = "REPEAT";
  reswrd[ 35][ 0] = "IF";
  reswrd[ 36][ 0] = "RETURN";
  reswrd[ 37][ 0] = "EXIT";
  reswrd[ 38][ 0] = "LOOP";
  reswrd[ 39][ 0] = "WITH";
  reswrd[ 40][ 0] = "INTEGER";
} // end InitResWrds

// initialize reserved word symbols (from Token enum above)
void Initreswrdsym_OHHELLOs() 
{
  reswrdsym_OHHELLO[ 0] = BOOLEAN_SYM;
  reswrdsym_OHHELLO[ 1] = CHAR_SYM;
  reswrdsym_OHHELLO[ 2] = FALSE_SYM;
  reswrdsym_OHHELLO[ 3] = TRUE_SYM;
  reswrdsym_OHHELLO[ 4] = NEW_SYM;
  reswrdsym_OHHELLO[ 5] = REAL_SYM;
  reswrdsym_OHHELLO[ 6] = ARRAY_SYM;
  reswrdsym_OHHELLO[ 7] = IMPORT_SYM;
  reswrdsym_OHHELLO[ 8] = THEN_SYM;
  reswrdsym_OHHELLO[ 9] = BEGIN_SYM;
  reswrdsym_OHHELLO[ 10] = IN_SYM;
  reswrdsym_OHHELLO[ 11] = TO_SYM;
  reswrdsym_OHHELLO[ 12] = BY_SYM;
  reswrdsym_OHHELLO[ 13] = IS_SYM;
  reswrdsym_OHHELLO[ 14] = CASE_SYM;
  reswrdsym_OHHELLO[ 15] = MOD_SYM;
  reswrdsym_OHHELLO[ 16] = TYPE_SYM;
  reswrdsym_OHHELLO[ 17] = CONST_SYM;
  reswrdsym_OHHELLO[ 18] = MODULE_SYM;
  reswrdsym_OHHELLO[ 19] = UNTIL_SYM;
  reswrdsym_OHHELLO[ 20] = DIV_SYM;
  reswrdsym_OHHELLO[ 21] = NIL_SYM;
  reswrdsym_OHHELLO[ 22] = VAR_SYM;
  reswrdsym_OHHELLO[ 23] = DO_SYM;
  reswrdsym_OHHELLO[ 24] = OF_SYM;
  reswrdsym_OHHELLO[ 25] = WHILE_SYM;
  reswrdsym_OHHELLO[ 26] = ELSE_SYM;
  reswrdsym_OHHELLO[ 27] = OR_SYM;
  reswrdsym_OHHELLO[ 28] = ELSIF_SYM;
  reswrdsym_OHHELLO[ 29] = POINTER_SYM;
  reswrdsym_OHHELLO[ 30] = END_SYM;
  reswrdsym_OHHELLO[ 31] = PROCEDURE_SYM;
  reswrdsym_OHHELLO[ 32] = RECORD_SYM;
  reswrdsym_OHHELLO[ 33] = FOR_SYM;
  reswrdsym_OHHELLO[ 34] = REPEAT_SYM;
  reswrdsym_OHHELLO[ 35] = IF_SYM;
  reswrdsym_OHHELLO[ 36] = RETURN_SYM;
  reswrdsym_OHHELLO[ 37] = EXIT_SYM;
  reswrdsym_OHHELLO[ 38] = LOOP_SYM;
  reswrdsym_OHHELLO[ 39] = WITH_SYM;
  reswrdsym_OHHELLO[ 40] = INTEGER_SYM;
} // end Initreswrdsym_OHHELLOs

// call all methods necessary to set up the scanner 
void InitCompile() 
{
  InitResWrds();
  Initreswrdsym_OHHELLOs();
  InitSpSyms();
  InitSymNames_NEWFCT();
  InitErrMsgs();
} // end InitCompile

// method to print the error message corresponding to the index 
// of eNum in the array errmsg
void error( int eNum) 
{
  fputs( "------------------------------------\n", stdout);
  fputs( errmsg[ eNum][ 0], stdout);
  fputs( "\n------------------------------------\n", stdout);
  // sym = invalid_sym;
} // end error

// return true if c is a separator
// (whitespace, horizontal tab, newline, carriage return)
bool inSeparators( char c) 
{
  if (c == ' ' || c == '\t' || c == '\n' || c == '\r')
    return true;
  return false;
}

// return true if c is a lowercase letter
bool inLowecase( char c) 
{
  return c >= 'a' && c <= 'z';
}

// return true if c is an uppercase letter
bool inUppercase( char c) 
{
  return c >= 'A' && c <= 'Z';
}

// return true if c is a letter (upper or lowercase)
bool inLetters( char c) 
{
  return inLowecase(c) || inUppercase(c);
}

// return true if c is a digit (number in [0, 9])
bool inDigits( char c) 
{
  return c >= '0' && c <= '9';
}

// return true if c is a hex digit
// this includes numbers in [0, 9], and letters in [A, F]
bool inHexDigits( char c) 
{
  return (c >= 'A' && c <= 'F') || inDigits( c);
}

