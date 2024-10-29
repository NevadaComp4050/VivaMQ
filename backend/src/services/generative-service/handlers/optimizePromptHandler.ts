export async function handleOptimizePrompt(data: any, uuid: string) {
  const { originalPrompt, configParams } = data;

  console.log('Optimize Prompt Response:', originalPrompt, configParams);
}
