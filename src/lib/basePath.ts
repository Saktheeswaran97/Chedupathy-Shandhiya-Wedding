const raw = process.env.NEXT_PUBLIC_BASE_PATH || "";
export const basePath = raw.endsWith("/") ? raw.slice(0, -1) : raw;

export const asset = (path: string) => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
    return path;
  }
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${basePath}${cleanPath}`;
};
