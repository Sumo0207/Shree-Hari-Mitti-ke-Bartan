import { useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { MessageSquare } from "lucide-react";

interface EnquiryFormProps {
    productName?: string;
    productId?: string;
    trigger?: React.ReactNode;
}

interface FormData {
    name: string;
    email: string;
    phone: string;
    message: string;
}

export function EnquiryForm({ productName, productId, trigger }: EnquiryFormProps) {
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true);
        try {
            const { error } = await supabase
                .from("inquiries")
                .insert({
                    customer_name: data.name,
                    customer_email: data.email,
                    customer_phone: data.phone,
                    message: data.message,
                    product_id: productId,
                });

            if (error) throw error;

            toast.success("Enquiry sent successfully! We will contact you soon.");
            reset();
            setOpen(false);
        } catch (error) {
            console.error("Error sending enquiry:", error);
            toast.error("Failed to send enquiry. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="default" className="gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Enquire Now
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Enquire about {productName || "our products"}</DialogTitle>
                    <DialogDescription>
                        Fill out the form below and we'll get back to you shortly.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Input
                            placeholder="Your Name"
                            {...register("name", { required: "Name is required" })}
                        />
                        {errors.name && (
                            <span className="text-xs text-red-500">{errors.name.message}</span>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Input
                            type="email"
                            placeholder="Email Address"
                            {...register("email")}
                        />
                    </div>

                    <div className="space-y-2">
                        <Input
                            type="tel"
                            placeholder="Phone Number (Optional)"
                            {...register("phone")}
                        />
                    </div>

                    <div className="space-y-2">
                        <Textarea
                            placeholder="Your Message..."
                            className="min-h-[100px]"
                            {...register("message", { required: "Message is required" })}
                            defaultValue={productName ? `I am interested in ${productName}. Please provide more details.` : ""}
                        />
                        {errors.message && (
                            <span className="text-xs text-red-500">{errors.message.message}</span>
                        )}
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Sending..." : "Send Enquiry"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
