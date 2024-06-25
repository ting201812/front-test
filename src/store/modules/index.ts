const files: Record<string, any> = import.meta.globEager('./*/*.ts');

const modules: Record<string, any> = {};

Object.keys(files).forEach((item: string) => {
  const module = files[item].default;

  if (module && module.namespaced) {
    const key: string = item.replace(/((\.\/[^\\/]+\/)|\.\/|\.ts)/g, '');

    modules[key] = module;
  }
});

export default modules;
