

uniform sampler2D uTexture;
uniform vec2 uPlaneResolution;
uniform vec2 uTextureSize;

varying vec2 vUv;

vec2 getUV(vec2 uv, vec2 texureSize, vec2 planesize){
	vec2 tempUV = uv - vec2(.5);

	float planeAspect = uPlaneResolution.x / uPlaneResolution.y;
	float textureAspect = uTextureSize.x / uTextureSize.y;
	if(planeAspect < textureAspect){
		tempUV = tempUV * vec2(planeAspect/textureAspect, 1.);
	}else{
		tempUV = tempUV * vec2(1., textureAspect/planeAspect);
	}


	tempUV += 0.5;
	return tempUV;
}

void main()	{

	vec2 newUV = getUV(vUv, uTextureSize, uPlaneResolution);

	vec4 image = texture2D(uTexture, newUV);

	gl_FragColor = image;

}