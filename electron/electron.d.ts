declare global {
    interface Map<K, V> {
        /**
         * Retorna um item cuja chave corresponda à fornecida ao método.
         * Se nenhum corresponder, emite um erro.
         */
        assert(key: K, message?: string): V;
    }

    interface NumberConstructor {
        assertInteger(rawString: string, radix?: number): number
    }
}

export {};