import { Rule, SchematicContext, Tree, SchematicsException, chain } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

export function install(_options: any): Rule {
  return chain([addDevDependencies, modifyTsConfig]);
}

export function addDevDependencies(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {

    const buf = tree.read('package.json');
    if (!buf) {
      throw new SchematicsException('cannot find package.json');
    }
    const content = JSON.parse(buf.toString('utf-8'));
    content.devDependencies = {
      ...content.devDependencies, 
      '@angular/language-service': 'latest',
    };
    tree.overwrite('package.json', JSON.stringify(content, null, 2));

    _context.addTask(new NodePackageInstallTask());
    return tree;
  };
}

export function modifyTsConfig(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {

    const buf = tree.read('tsconfig.json');
    if (!buf) {
      throw new SchematicsException('cannot find tsconfig.json');
    }
    const content = JSON.parse(buf.toString('utf-8'));
    content.compilerOptions = {
      ...content.compilerOptions,
      plugins: [
        ...content.compilerOptions.plugins || [],
        { "name": "@angular/language-service" },
      ],
    };
    tree.overwrite('tsconfig.json', JSON.stringify(content, null, 2));
    return tree;
  };
}
