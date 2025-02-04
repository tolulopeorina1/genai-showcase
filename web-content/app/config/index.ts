export const apiBase = process.env.NEXT_PUBLIC_BASE_URL;

export const getApiPathNoVersion = (pathRoot: string, path?: string) => {
  return `${apiBase}/api/${pathRoot}`;
};
