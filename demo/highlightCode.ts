const codeTokens = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|<\/?[A-Za-z][\w.]*(?=[\s/>])|\b(?:import|from|export|default|const|let|var|function|return|async|await|type|interface|new|true|false|null|undefined|if|else)\b|\b\d+(?:\.\d+)?\b|\b[A-Za-z_$][\w$]*(?=\s*\()|[{}()[\].,;:=<>!?|&+*/-])/g;

function escapeHtml(value: string) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}

export function highlightCode(source: string) {
  return source.replace(codeTokens, (token) => {
    const className = token.startsWith('//') || token.startsWith('/*') ? 'code-token--comment'
      : token.startsWith('"') || token.startsWith("'") || token.startsWith('`') ? 'code-token--string'
        : token.startsWith('<') ? 'code-token--tag'
          : /^(?:import|from|export|default|const|let|var|function|return|async|await|type|interface|new|true|false|null|undefined|if|else)$/.test(token) ? 'code-token--keyword'
            : /^\d/.test(token) ? 'code-token--number'
              : /^[A-Za-z_$]/.test(token) ? 'code-token--function'
                : 'code-token--punctuation';
    return `<span class="${className}">${escapeHtml(token)}</span>`;
  }).split(/(<span class="[^"]+">[\s\S]*?<\/span>)/g).map((part) => part.startsWith('<span ') ? part : escapeHtml(part)).join('');
}
