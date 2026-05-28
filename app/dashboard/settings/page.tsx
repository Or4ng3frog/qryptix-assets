import { getDashboardData } from '@/lib/dashboard-data';
import { PageTitle } from '@/components/dashboard-ui';
import { SettingsForm } from '@/components/SettingsForm';

export default async function SettingsPage() {
  const data = await getDashboardData();
  if (!data) return null;

  return (
    <>
      <PageTitle title="Account Settings" subtitle="Manage your profile and jurisdiction details." />
      <SettingsForm profile={data.profile} />
    </>
  );
}
