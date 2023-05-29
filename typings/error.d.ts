type ErrorLogBase = {
    readonly id: number;
    readonly pending: boolean;
    readonly name: string;
    readonly message: string;
    readonly stack: string | null;
};

interface ErrorLogType extends EnvironmentInfo, ErrorLogBase {
    readonly world: World | null;
    readonly url: string;
};

type ElectronErrorLogType = EnvironmentInfo & ErrorLogBase;

type OmitOptionalErrorLogProps<T> = Omit<T, 'id' | 'pending'>;
type AllErrorLogTypes = 
    | OmitOptionalErrorLogProps<ElectronErrorLogType> & Partial<Pick<ErrorLogBase, 'id' | 'pending'>>
    | OmitOptionalErrorLogProps<ErrorLogType> & Partial<Pick<ErrorLogBase, 'id' | 'pending'>>;

type ErrorCard<T extends ElectronErrorLogType | ErrorLogType> = Omit<T, 'id'> & { id: string };