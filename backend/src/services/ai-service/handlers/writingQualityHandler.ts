export async function handleWritingQuality(data: any, uuid: string) {
  const { document, criteria } = data;

  console.log('Writing Quality Response:', document, criteria);
}
