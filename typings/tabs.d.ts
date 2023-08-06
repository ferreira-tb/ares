type BackForwardStatus = {
    canGoBack: boolean;
    canGoForward: boolean;
};

interface CreateBrowserTabOptions {
    current?: boolean;
    url?: string;
}