/**
 * Indicator deep-dive route — /indicator/[id]
 */
import { IndicatorDeepDive } from "@/components/IndicatorDeepDive";
import { MODULES } from "@/modules/registry";

export function generateStaticParams() {
  return MODULES.map((m) => ({ id: m.id }));
}

export default async function IndicatorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <IndicatorDeepDive moduleId={id} />;
}
