
vec3 getSunDirection(vec3 cameraPosition) {

  vec3 rotationAxis = cameraPosition;
  rotationAxis.y = rotationAxis.x;
  rotationAxis.x = rotationAxis.z;
  rotationAxis.z = -rotationAxis.y;
  rotationAxis.y = 0.0;
  rotationAxis = normalize(rotationAxis);
  rotationAxis.y = 0.5;
  rotationAxis = normalize(rotationAxis);
  
  float sinA = -0.52268;
  float cosA = 0.85252;
  vec4 quat = vec4(
    rotationAxis.x * sinA,
    rotationAxis.y * sinA,
    rotationAxis.z * sinA,
    cosA
  );
  quat = normalize(quat);

  float xx = quat.x * quat.x;
  float xy = quat.x * quat.y;
  float xz = quat.x * quat.z;
  float xw = quat.x * quat.w;
  float yy = quat.y * quat.y;
  float yz = quat.y * quat.z;
  float yw = quat.y * quat.w;
  float zz = quat.z * quat.z;
  float zw = quat.z * quat.w;
  mat3 rotationMatrix = mat3(
    1.0 - 2.0 * ( yy + zz ),
    2.0 * ( xy - zw ),
    2.0 * ( xz + yw ),
    2.0 * ( xy + zw ),
    1.0 - 2.0 * ( xx + zz ),
    2.0 * ( yz - xw ),
    2.0 * ( xz - yw ),
    2.0 * ( yz + xw ),
    1.0 - 2.0 * ( xx + yy )
  );

  return normalize(cameraPosition * rotationMatrix);

}
