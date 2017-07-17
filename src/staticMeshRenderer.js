
import Tactile from 'tactile-core-web';
import Three from 'three';

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

    if (typeof init.vertices !== 'array') {
      throw new Error('init data must include an array of vertices');
    }

    const geometry = new Three.BufferGeometry;
    const vertices = new Float32Array(init.vertices);
    const material = new Three.MeshLambertMaterial({
      color: init.color || 0x7e57c2,
    });

    geometry.addAttribute('position', new Three.BufferAttribute(vertices, 3));

    return {
      position: init.position || {x: 0, y: 0, z: 0},
      mesh: new Three.Mesh(geometry, material),
    };
  }

  /**
   * Performs internal state mutations.
   * @param {object} state The internal state.
   * @param {object} action The action we are going to reduce (maybe).
   * @return {object} The new state.
   */
  reducer(state = {views: []}, {type, renderer, ...action}) {
    switch (type) {
      case '@Init/Renderer':
        return Object.assign({}, state, {renderer});
      case 'View/Add':
        const {views, ...state} = state;
        return {
          views: views.push(action.scene),
          ...state,
        };
      case 'Entity/Create':
      case 'Entity/Add':
        const {systems, ...component} = action;
        if (systems.includes(this.getSystemId())) {
          const {views, ...state} = state;
          for (let i = 0; i < views.length; i++) {
            views[i].scene.add(component);
          }
          return {
            scenes,
            ...state,
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
