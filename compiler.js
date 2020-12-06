

const lex = str => str.split(' ').map(s => s.trim()).filter(s => s.length);


const Operation = Symbol('op');
const Numbr = Symbol('num');
const varible = Symbol('var');

const parse = token => {

  let c = 0;
  const peek = () => token[c];
  const consume = () => token[c++];

  const parseNum = () => ({ val: parseInt(consume()), type: Numbr });

  const parseOp = () => {
    const node = { val: consume(), type: Operation, expr: [] };
    while (peek()) node.expr.push(parseExpr());
    return node;
  };

  const parseExpr = ()=>/\d/.test(peek()) ? parseNum() : parseOp();

  return parseExpr();
};


const evaluate = ast => {
  const opAcMap = {
    '+': args => args.reduce((a, b) => a + b, 0),
    '-': args => args.reduce((a, b) => a - b),
    '/': args => args.reduce((a, b) => a / b),
    '*': args => args.reduce((a, b) => a * b, 1)
  };

  if (ast.type === Numbr)  return ast.val;
  return opAcMap[ast.val](ast.expr.map(evaluate));
};


const compile = ast => {
  const opMap = { '+': '+', '*': '*', '-': '-', '/': '/' };
  const compileNum = ast => ast.val;
  const compileOp = ast => `(${ast.expr.map(compile).join(' ' + opMap[ast.val] + ' ')})`;
  const compile = ast => ast.type === Numbr ? compileNum(ast) : compileOp(ast);
  return compile(ast);
};

//console.log(compile(parse(lex(program))));
