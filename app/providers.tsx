'use client';

import React from 'react';
import {Provider} from 'react-redux';
import {store} from '@/store/store';
import AppShell from './AppShell';

const Providers = ({children}: { children: React.ReactNode }) => {
    return (
        <Provider store={store}>
            <AppShell>{children}</AppShell>
        </Provider>
    );
};

export default Providers;