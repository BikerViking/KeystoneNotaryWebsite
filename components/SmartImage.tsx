import React, { useMemo, useState } from 'react';

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  fallbackClassName?: string;
  sources?: string[]; // optional fallback list of srcs to try in order
};

// Renders an <img> that hides itself if the resource fails to load.
// This avoids broken-image icons when optional brand assets are missing.
const SmartImage: React.FC<Props> = ({ fallbackClassName, sources, src, ...rest }) => {
  const ordered = useMemo(() => (sources && sources.length ? sources : src ? [src] : []), [sources, src]);
  const [index, setIndex] = useState(0);
  if (!ordered.length) return null;
  const current = ordered[Math.min(index, ordered.length - 1)];
  const onError = () => {
    if (index < ordered.length - 1) setIndex(index + 1);
  };
  return (
    <img
      {...rest}
      src={current}
      onError={onError}
      loading={(rest as any).loading || 'lazy'}
      decoding={(rest as any).decoding || 'async'}
      onLoad={(rest as any).onLoad}
      className={rest.className}
    />
  );
};

export default SmartImage;
