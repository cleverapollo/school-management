function addSpacesToClosingTags(inputString: string) {
  const closingTagPattern = /<\/\w+>/g;
  return inputString.replace(closingTagPattern, (match) => `${match} `);
}

export function getTextFromHtml(html: string): string {
  const htmlWithSpaces = addSpacesToClosingTags(html);
  const doc = new DOMParser().parseFromString(htmlWithSpaces, 'text/html');
  return doc.body.textContent || '';
}
