import { getProfiles } from "./actions";
import { ProfilesContent } from "@/components/profiles/profiles-content";

export default async function ProfilesPage() {
    const { data: profiles, totalCount } = await getProfiles(1, 10);
    return <ProfilesContent initialProfiles={profiles || []} initialTotalCount={totalCount || 0} />;
}
