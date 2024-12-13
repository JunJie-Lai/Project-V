import {createViewerToken} from "@/actions/token";
import {useEffect, useState} from "react";
import {toast } from "sonner";
import {jwtDecode, JwtPayload} from "jwt-decode";

export const useMultipleViewerToken = (hostIdentities: string[]) => {
    const [tokens, setTokens] = useState<string[]>([]);
    const [names, setNames] = useState<string[]>([]);
    const [identities, setIdentities] = useState<string[]>([]);

    useEffect(() => {
        const createTokens = async () => {
            try {
                const tokenPromises = hostIdentities.map((hostIdentity) => createViewerToken(hostIdentity));

                const viewerTokens = await Promise.all(tokenPromises);

                setTokens(viewerTokens);

                const decodedTokens = viewerTokens.map((viewerToken) => {
                    const decoded = jwtDecode(viewerToken) as JwtPayload & { name?: string };
                    return {
                        name: decoded?.name,
                        identity: decoded.sub,
                    };
                });

                setNames(decodedTokens.map((decoded) => decoded.name || ""));
                setIdentities(decodedTokens.map((decoded) => decoded.identity || ""));
            } catch {
                toast.error("Something went wrong");
            }
        };

        createTokens().catch(() => toast.error("Something went wrong"));
    }, [hostIdentities]);

    return { tokens, names, identities };
};
