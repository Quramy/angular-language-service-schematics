// import { Tree } from '@angular-devkit/schematics';
import * as path from 'path';

import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';

import { getFileContent } from '@schematics/angular/utility/test';

const collectionPath = path.join(__dirname, '../../collection.json');

function createTestApp(appOptions: any = { }): UnitTestTree {
  const baseRunner = new SchematicTestRunner('schematics', collectionPath);

  const workspaceTree = baseRunner.runExternalSchematic(
    '@schematics/angular',
    'workspace',
    {
      name: 'workspace',
      version: '7.1.2',
      newProjectRoot: 'projects',
    },
  );

  return baseRunner.runExternalSchematic(
    '@schematics/angular',
    'application',
    {
      ...appOptions,
      name: 'example-app',
    },
    workspaceTree,
  );
}

describe('lang-service', () => {
  it('should add @angular/language-service to package.json', () => {

    const runner = new SchematicTestRunner('schematics', collectionPath);
    const tree = runner.runSchematic('ng-add', {}, createTestApp());

    expect(tree.files).toContain('/package.json');
    expect(tree.files).toContain('/tsconfig.json');

    const packageJson = JSON.parse(getFileContent(tree, '/package.json'));

    expect(packageJson.devDependencies['@angular/language-service']).toBe('latest');

    const tsconfig = JSON.parse(getFileContent(tree, '/tsconfig.json'));
    expect(tsconfig.compilerOptions.plugins.map((_: { name: string }) => _.name)).toContain('@angular/language-service');
  });
});
