
import {StaticMeshRenderer} from './staticMeshRenderer';
import * as Three from 'three';
import {Set} from 'immutable';

const renderer = new StaticMeshRenderer();

it('should construct a static mesh renderer', () => {
  expect(renderer).not.toBeNull();
});

it('should throw if makeComponent is called with no params', () => {
  expect(() => renderer.makeComponent()).toThrow();
});

it('should throw if makeComponent is called with a non-object', () => {
  expect(() => renderer.makeComponent(false)).toThrow();
});

it('should throw if makeComponent is called without vertices', () => {
  expect(() => renderer.makeComponent({})).toThrow();
});

it('should throw if makeComponent is called with non-array vertices', () => {
  expect(() => renderer.makeComponent({vertices: {}})).toThrow();
});

it('should construct a component with vertices only', () => {
  const vertices = [
    0, 0, 0,
    1, 1, 0,
  ];
  const component = renderer.makeComponent({vertices});
  expect(component).not.toBeNull();
});

it('should construct a component withe the default color', () => {
  const defaultHex = 0x7e57c2;
  const defaultColor = new Three.Color(
    ((defaultHex & 0xff0000) >> 16) / 0xff,
    ((defaultHex & 0x00ff00) >> 8) / 0xff,
    (defaultHex & 0x0000ff) / 0xff,
  );
  const vertices = [0, 0, 0];

  const component = renderer.makeComponent({vertices});
  expect(component.material.color).toEqual(defaultColor);
});

it('should construct a component with the given color', () => {
  const vertices = [0, 0, 0];
  const component = renderer.makeComponent({vertices, color: 0x0});
  expect(component.material.color).toEqual(new Three.Color(0, 0, 0));
});

it('should update the mesh position', () => {
  // Arrange
  let component = renderer.makeComponent({vertices: [1, 1, 1]});

  // Pre act assertion
  expect(component.position).toEqual(new Three.Vector3(0, 0, 0));

  // Act
  component = renderer.updatePosition(component, new Three.Vector3(1, 1, 1));

  // Assert
  expect(component.position).toEqual(new Three.Vector3(1, 1, 1));
});

it('should draw all views that is knows about', () => {
  // Arrange
  const render = jest.fn();
  const scene = {};
  const camera = {};
  const views = [{
    scene,
    camera,
  }, {
    scene,
    camera,
  }];
  const internal = {renderer: {render}, views};

  // Act
  renderer.draw(1, {internal});

  // Assert
  expect(render).toHaveBeenCalledTimes(2);
});

it('should reduce @Init/Renderer to save the renderer', () => {
  const action = {type: '@Init/Renderer', renderer: 5};
  const result = renderer.reducer(undefined, action);
  expect(result).toEqual({views: [], renderer: 5});
});

it('should reduce View/Add to add a view', () => {
  const action = {type: 'View/Add', scene: 1};
  const result = renderer.reducer(undefined, action);
  expect(result.views.length).toBe(1);
  expect(result.views[0]).toBe(1);
});
