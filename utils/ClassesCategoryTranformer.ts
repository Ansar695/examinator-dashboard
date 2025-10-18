import { Class } from "@/lib/api/educationApi";

type GroupedClasses = {
  [key in Class["type"]]: Class[];
};

export const transformClasses = (data: Class[]): any => {
  const grouped = data.reduce(
    (acc: any, item) => {
      acc[item?.type]?.push(item);
      return acc;
    },
    {
      PRIMARY: [] as Class[],
      SECONDARY: [] as Class[],
      HIGHER_SECONDARY: [] as Class[],
      INTERMEDIATE: [] as Class[],
    }
  );

  // sort inside each category (ascending by numeric name)
  (Object.keys(grouped) as (keyof GroupedClasses)[]).forEach((key) => {
    grouped[key].sort((a: any, b: any) => Number(a.name) - Number(b.name));
  });

  return grouped;
};