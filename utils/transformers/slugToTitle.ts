export const slugToTitle = (slug: string): string => {
    return slug
      .split('-')
      .join(' ');
  }