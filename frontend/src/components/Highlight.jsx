function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export default function Highlight({ text, term }) {
  const needle = term ? term.trim() : '';
  if (!needle || !text) return text;

  return text
    .split(new RegExp(`(${escapeRegExp(needle)})`, 'gi'))
    .map((part, index) => (index % 2 === 1 ? <mark key={index}>{part}</mark> : part));
}
