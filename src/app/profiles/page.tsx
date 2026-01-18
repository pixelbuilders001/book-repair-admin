import { getProfiles } from "./actions";
import { ProfilesContent } from "@/components/profiles/profiles-content";

export default async function ProfilesPage() {
    const profiles = await getProfiles();
    return <ProfilesContent initialProfiles={profiles} />;
}
