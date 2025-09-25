export interface ParsedTask {
  type: 'call' | 'whatsapp' | 'email' | 'website';
  target: string;
  originalText: string;
}

export const parseTaskCommand = (text: string): ParsedTask | null => {
  const lowerText = text.toLowerCase().trim();
  
  // Phone call patterns
  if (lowerText.includes('call')) {
    const match = lowerText.match(/call\s+(.+)/);
    if (match) {
      return {
        type: 'call',
        target: match[1].trim(),
        originalText: text
      };
    }
  }
  
  // WhatsApp patterns
  if (lowerText.includes('whatsapp') || lowerText.includes('message')) {
    const match = lowerText.match(/(?:whatsapp|message)\s+(.+)/);
    if (match) {
      return {
        type: 'whatsapp',
        target: match[1].trim(),
        originalText: text
      };
    }
  }
  
  // Email patterns
  if (lowerText.includes('email')) {
    const match = lowerText.match(/email\s+(.+)/);
    if (match) {
      return {
        type: 'email',
        target: match[1].trim(),
        originalText: text
      };
    }
  }
  
  // Website/URL patterns
  if (lowerText.includes('open') || lowerText.includes('visit') || lowerText.includes('website')) {
    const match = lowerText.match(/(?:open|visit|website)\s+(.+)/);
    if (match) {
      return {
        type: 'website',
        target: match[1].trim(),
        originalText: text
      };
    }
  }
  
  return null;
};

export const generateDeepLink = (task: ParsedTask): string => {
  switch (task.type) {
    case 'call':
      return `tel:${task.target}`;
    case 'whatsapp':
      return `https://wa.me/?text=Hello ${task.target}`;
    case 'email':
      return `mailto:${task.target}`;
    case 'website':
      const url = task.target.startsWith('http') ? task.target : `https://${task.target}`;
      return url;
    default:
      return '';
  }
};
