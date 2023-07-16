import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Icons } from "@/components/icons"
import Link from "next/link"

export function InfoAlert() {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Icons.info className="h-4 w-4 text-muted-foreground hover:text-gray-700" />
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle >
                        Found any bug/issue?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        You are using a preview testing version. Please let us know on <Link href={"https://github.com/sujjeee"} className="text-blue-600 font-semibold"> GitHub </Link> or <Link href={"https://twitter.com/sujjeeee"} className="text-blue-600 font-semibold"> Twitter </Link>  if you experience any bugs or issues.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Okay</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

