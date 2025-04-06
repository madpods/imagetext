export interface Env {
	AI: Ai;
  }
  
  export default {
	async fetch(request: Request, env: Env): Promise<Response> {
	  if (request.method !== 'POST') {
		return new Response("Method Not Allowed", { status: 405 });
	  }
  
	  let imageData;
	  try {
		  imageData = await request.arrayBuffer();
	  } catch (error) {
		  return new Response("Failed to read request body", {status: 400});
	  }
  
	  if (!imageData || imageData.byteLength === 0){
		   return new Response("No image data provided", {status: 400});
	  }
  
	  const input = {
		image: [...new Uint8Array(imageData)],
		prompt: "Generate a caption for this image",
		max_tokens: 512,
	  };
  
	  try{
		  const response = await env.AI.run(
		  "@cf/unum/uform-gen2-qwen-500m",
		  input
		  );
		  return new Response(JSON.stringify(response));
	  }
	  catch(error){
		  console.error("Error running AI model", error)
		return new Response("Error running AI model", {status: 500})
	  }
  
	},
  } satisfies ExportedHandler<Env>;  