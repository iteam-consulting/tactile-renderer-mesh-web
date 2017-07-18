
import Tactile from 'tactile-core-web';
import * as Three from 'three';

/**
 * Provides a render system for rendering static meshes.
 */
export class StaticMeshRenderer extends Tactile.Renderer {
  /**
   * Create a new component for this system.
   * @param {object} init The initialization data.
   * @return {object} The component that will be rendered
   */
  makeComponent(init) {
    // At the very least, we need an array of vertices.
    if (typeof init !== 'object') {
      throw new Error('init data must be an object');
    }

    if (!Array.isArray(init.vertices)) {
      throw new Error('init data must include an array of vertices');
    }

    const geometry = new Three.BufferGeometry();
    const vertices = new Float32Array(init.vertices);
    const material = new Three.MeshLambertMaterial({
      color: typeof init.color === 'number' ? init.color : 0x7e57c2,
    });

    geometry.addAttribute('position', new Three.BufferAttribute(vertices, 3));

    return new Three.Mesh(geometry, material);
  }

  /**
   * Update the position of a mesh.
   * @param {object} component The component to update
   * @param {object} position The new position.
   * @return {object} The updated position.
   */
  updatePosition(component, position) {
    component.position.x = position.x;
    component.position.y = position.y;
    component.position.z = position.z;

    return component;
  }

  /**
   * Performs internal state mutations.
   * @param {object} state The previous state.
   * @param {object} action The action we are going to reduce (maybe).
   * @return {object} The new state.
   */
  reducer(state = {views: []}, {type, renderer, ...action}) {
    const {views, ...rest} = state;
    switch (type) {
      case '@Init/Renderer':
        return Object.assign({}, state, {renderer});
      case 'View/Add':
        views.push(action.scene);
        return {
          views,
          ...rest,
        };
      case 'Entity/Create':
      case 'Entity/Add':
        const {systems, ...component} = action;
        if (systems.includes(this.getSystemId())) {
          for (let i = 0; i < views.length; i++) {
            views[i].scene.add(component);
          }
          return {
            scenes,
            ...rest,
          };
        }
        return state;
      default:
        return state;
    }
  }

  /**
   * Draw components in this system.
   * @param {number} delta The current timestep delta
   * @param {object} state The state of this system
   */
  draw(delta, {internal}) {
    if (internal.renderer) {
      for (let i = 0; i < internal.views.length; i++) {
        const {scene, camera} = internal.views[i];
        internal.renderer.render(scene, camera);
      }
    }
  }
}
