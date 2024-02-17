import { useMemo } from 'react';
import { Box } from '@mui/material';
import { sanitize } from 'dompurify';

interface LinkRenderProps {
  text: string | null | undefined;
}

export function LinkRender({ text }: LinkRenderProps) {
  const parsedText = useMemo(() => {
    if (!text) {
      return '';
    }

    // Regular expression for detecting links in the format "(href)[linkName]"
    const linkPattern = /\((http[s]?:\/\/\S+)\)\[(.*?)\]/g;
    const textWithCustomLinkParsed = text.replace(
      linkPattern,
      (_, href: string, linkName: string) =>
        `<a href="${href}" rel="noopener noreferrer">${linkName}</a>`
    );

    // Regular expression for detecting links starting with http or https
    const httpLinkPattern = /(?<!(href="|>))http[s]?:\/\/\S+(?!("|<))/g;
    const finalParsedText = textWithCustomLinkParsed.replace(
      httpLinkPattern,
      (url) => `<a href="${url}" rel="noopener noreferrer">${url}</a>`
    );

    return sanitize(finalParsedText, {
      USE_PROFILES: { html: true },
      ALLOWED_TAGS: ['a'],
      ALLOWED_ATTR: ['href', 'target', 'rel'],
    });
  }, [text]).replace(
    /rel="noopener noreferrer/g,
    'target="_blank" rel="noopener noreferrer'
  );

  // eslint-disable-next-line react/no-danger
  return (
    <Box
      component="span"
      sx={{
        '& a': {
          color: 'primary.main',
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'underline',
          },
        },
      }}
      dangerouslySetInnerHTML={{ __html: parsedText }}
    />
  );
}
