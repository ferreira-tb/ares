type BackForwardStatus = {
    canGoBack: boolean;
    canGoForward: boolean;
};

interface CreateBrowserTabOptions {
    current?: boolean;
    main?: boolean;
    url?: string;
};