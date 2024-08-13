import Player from '@renderer/components/Player';
import SideBar from '@renderer/components/SideBar';
import React from 'react';

const WithSideBar = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="grid grid-cols-[200px_1fr] gap-6">
            <SideBar />
            <div className="grid grid-rows-[calc(100vh-80px)_80px]">
                <div className="py-4">{children}</div>
                <Player />
            </div>
        </div>
    );
};

export default WithSideBar;
