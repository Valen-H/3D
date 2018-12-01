# 3D  
A 3D framework with 2D projection for ES5+. Sample (Orthographic projection): https://valentinhacker.github.io/3D/3D.html  
  
**Sick and tired of your old mobile not being able to use WebGL? ... No More!**  
  
## Usage  
```javascript
var map = new D3Map(500); /* the only parameter is the distance of the camera from the center of the plane (Z-pivot)  */
map.add(50, 50, 50); /* add a new 3d point to the map, returns a D3Vertex  */
/**
 * The D3Vertex object contains the ed projected coordinates of the point as vtex.coords and the 2d projection as vtex.coord2d
 * The D3Map object contains the methods map.translate(x, y, z) and map.rotate(x, y, z) for controling the camera
 * There's also a hidden D3Cube struct for convenience...
 * Thats it! you can start making your own structures out of those points! read the .js files for more documentation...
*/
```  
  
> Note: you must implement your own algorithm to clip your objects behind camera, currently, the sample code (.html) seems glitchy because objects behind the camera are being rendered as if the camera was 'inside' them.  
