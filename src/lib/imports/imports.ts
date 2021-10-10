export interface Import {
  defaultName?: string;
  moduleNames: string[];
  moduleSpecifier: string;
  named?: Record<string, string>;
  packageName: string | null;
}
