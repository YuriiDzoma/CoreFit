import ChatThreadSkeleton from './components/chatThreadSkeleton';

// Shown instantly on navigation, before this route's own code has loaded --
// on a slow connection that gap used to be a blank screen.
export default function Loading() {
    return <ChatThreadSkeleton />;
}
