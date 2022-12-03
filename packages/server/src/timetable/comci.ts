import acorn from 'acorn';
import * as walk from 'acorn-walk';
import {
  BinaryExpression,
  CallExpression,
  FunctionDeclaration,
  Identifier,
  Literal,
  MemberExpression,
  ObjectExpression,
  Property,
} from 'estree';

export function findByType(node: acorn.Node, type: string) {
  return new Promise<acorn.Node>((resolve, reject) => {
    walk.simple(node, {
      [type]: (node) => {
        resolve(node);
      },
    });
  });
}

export function findPropertyByName(
  node: ObjectExpression,
  name: string,
): Property {
  return node.properties.find(
    (x) =>
      x.type === 'Property' &&
      x.key.type === 'Identifier' &&
      x.key.name === name,
  ) as Property;
}

export function find_school_ra_function(
  node: acorn.Node,
): Promise<FunctionDeclaration> {
  return new Promise((resolve, reject) => {
    walk.simple(node, {
      FunctionDeclaration(x, state) {
        const node = x as unknown as FunctionDeclaration;
        if (node.id?.name === 'school_ra') {
          resolve(node);
        }
      },
    });
  });
}

export function findAjax(node: acorn.Node): Promise<CallExpression> {
  return new Promise((resolve, reject) => {
    walk.simple(node, {
      CallExpression(x, state) {
        const node = x as unknown as CallExpression;
        const callee = node?.callee as MemberExpression;
        const property = callee?.property as Identifier;
        if (property?.name === 'ajax') {
          resolve(node);
        }
      },
    });
  });
}

export async function getAjaxUrl(node: CallExpression): Promise<string> {
  const options = (await findByType(
    node as unknown as acorn.Node,
    'ObjectExpression',
  )) as unknown as ObjectExpression;

  const value = findPropertyByName(options, 'url')
    .value as unknown as BinaryExpression;
  const left = value.left as unknown as Literal;
  return left.value as string;
}
