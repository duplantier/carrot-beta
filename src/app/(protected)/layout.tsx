import { auth } from "@/auth";
import { Page } from "@/components/PageLayout";
import ProtectedHeader from "@/components/protected-header";

export default async function TabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // If the user is not authenticated, redirect to the login page
  if (!session) {
    console.log("Not authenticated");
  }

  return (
    <Page>
      <ProtectedHeader />
      {children}
      {/*  <Page.Footer className="px-0 fixed bottom-0 w-full bg-white">
        <Navigation />
      </Page.Footer> */}
    </Page>
  );
}
