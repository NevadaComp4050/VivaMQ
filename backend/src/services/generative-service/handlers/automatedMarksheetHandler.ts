export async function handleAutomatedMarksheet(data: any, uuid: string) {
  const { document, rubric, learningOutcomes } = data;

  console.log(
    'Automated Marksheet Response:',
    document,
    rubric,
    learningOutcomes
  );
}
