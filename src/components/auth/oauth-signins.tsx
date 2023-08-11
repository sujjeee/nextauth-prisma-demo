"use client"

// import * as React from "react"
// import { signIn } from "next-auth/react"
// import { Button } from "@/components/ui/button"
// import { Loader2 } from "lucide-react"

// const oauthProviders = [
//   { name: "Google", strategy: "oauth_google", icon: "google" },
//   { name: "Facebook", strategy: "oauth_facebook", icon: "facebook" },
//   { name: "Discord", strategy: "oauth_discord", icon: "discord" },
// ]

// export function OAuthSignIn() {

//   const [isLoading, setIsLoading] = React.useState(false)

//   async function oauthSignIn(provider:any) {
//     // if(session) return null

//     try {
//       setIsLoading(true)
//       await signIn('google', { 
//         callbackUrl: "http://localhost:3000" 
//         //   setIsLoading(false)
//     })
//     } catch (error) {
//       setIsLoading(false)
//       console.error("Something went wrong, please try again.")
//     }
//   }

//   return (
//     <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-4">
//       {oauthProviders.map((provider) => {
//         return (
//           <Button
//             aria-label={`Sign in with ${provider.name}`}
//             // key={provider.strategy}
//             // variant="outline"
//             className="w-full bg-background sm:w-auto"
//             onClick={() => signIn(provider.strategy)}
//             // disabled={isLoading}
//           >
//             {isLoading ? (
//               <Loader2
//                 className="mr-2 h-4 w-4 animate-spin"
//                 aria-hidden="true"
//               />
//             ) : (
//             //   <Google className="mr-2 h-4 w-4" aria-hidden="true" />"0"
//             0
//             )}
//             {provider.name}
//           </Button>
//         )
//       })}
//     </div>
//   )
// }
import * as React from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons"

const oauthProviders = [
    { name: "Google", strategy: "google", icon: "google" },
    { name: "Facebook", strategy: "facebook", icon: "facebook" },
    { name: "Discord", strategy: "discord", icon: "discord" },
] as {
    name: string,
    strategy: string,
    icon: keyof typeof Icons
}[];

export function OAuthSignIn() {
    const [isLoading, setIsLoading] = React.useState<string | null>(null)

    async function oauthSignIn(provider: string) {
        try {
            setIsLoading(provider);
            const res = await signIn(provider, {
                callbackUrl: "http://localhost:3000",
                redirect: false
            });

        } catch (error) {
            setIsLoading(null);
            console.error("Something went wrong, please try again.");
        }
    }

    return (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-4">
            {oauthProviders.map((provider) => {

                // Disable the Facebook and Discord button 
                const isButtonDisabled = provider.strategy === "facebook" || provider.strategy === "discord"

                const Icon = Icons[provider.icon]
                return (
                    <Button
                        key={provider.strategy}
                        aria-label={`Sign in with ${provider.name}`}
                        variant="outline"
                        onClick={() => oauthSignIn(provider.strategy)}
                        // disabled={isLoading !== null || isButtonDisabled}
                        disabled={true}
                    >
                        {isLoading === provider.strategy ? (
                            <Icons.spinner
                                className="mr-2 h-4 w-4 animate-spin"
                                aria-hidden="true"
                            />
                        ) : (
                            <Icon className="mr-2 h-4 w-4" aria-hidden="true" />
                        )}
                        {provider.name}
                    </Button>
                )
            })}
        </div>
    );
}
