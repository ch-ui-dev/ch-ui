// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

const indent = (text: string, level: number) =>
  [...Array(level)].reduce((acc, _) => `  ${acc}`, text);

export const renderCondition = (
  block: string,
  level: number = 0,
  statements?: string[],
): string => {
  if (statements && statements.length > 0) {
    const [statement, ...nextStatements] = statements;
    return `${indent(`${statement} {`, level)}\n${renderCondition(
      block,
      level + 1,
      nextStatements,
    )}\n${indent('}', level)}`;
  } else {
    return level > 0 ? block.replace(/^(.+)/gm, indent('$1', level)) : block;
  }
};
