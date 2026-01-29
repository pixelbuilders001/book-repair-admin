"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { updateIssue } from "@/app/categories/actions";

interface Issue {
    id: string;
    category_id: string;
    title: string;
    description?: string | null;
    icon_url?: string;
    estimated_price?: number;
    is_active: boolean;
    sort_order?: number;
    base_min_fee?: number;
}

interface EditIssueModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    issue: Issue | null;
}

export function EditIssueModal({ isOpen, onClose, onSuccess, issue }: EditIssueModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        icon_url: "",
        base_min_fee: "",
        estimated_price: "",
        is_active: true,
        sort_order: "",
    });

    useEffect(() => {
        if (issue) {
            setFormData({
                title: issue.title || "",
                description: issue.description || "",
                icon_url: issue.icon_url || "",
                base_min_fee: issue.base_min_fee?.toString() || "",
                estimated_price: issue.estimated_price?.toString() || "",
                is_active: issue.is_active ?? true,
                sort_order: issue.sort_order?.toString() || "",
            });
        }
    }, [issue]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!issue) return;

        setLoading(true);
        setError(null);

        try {
            const issueData = {
                title: formData.title,
                description: formData.description || undefined,
                icon_url: formData.icon_url || undefined,
                base_min_fee: formData.base_min_fee
                    ? parseFloat(formData.base_min_fee)
                    : undefined,
                estimated_price: formData.estimated_price
                    ? parseFloat(formData.estimated_price)
                    : undefined,
                is_active: formData.is_active,
                sort_order: formData.sort_order
                    ? parseInt(formData.sort_order)
                    : undefined,
            };

            await updateIssue(issue.id, issueData);

            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.message || "Failed to update issue");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Edit Issue</DialogTitle>
                    <DialogDescription>
                        Update the repair issue details and pricing.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">
                                Issue Title <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) =>
                                    setFormData({ ...formData, title: e.target.value })
                                }
                                placeholder="e.g., Not Spinning"
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({ ...formData, description: e.target.value })
                                }
                                placeholder="Brief description of the issue"
                                rows={3}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="icon_url">Icon URL</Label>
                            <Input
                                id="icon_url"
                                value={formData.icon_url}
                                onChange={(e) =>
                                    setFormData({ ...formData, icon_url: e.target.value })
                                }
                                placeholder="https://example.com/icon.png"
                                type="url"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="base_min_fee">
                                    Base Min Fee (₹)
                                </Label>
                                <Input
                                    id="base_min_fee"
                                    value={formData.base_min_fee}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            base_min_fee: e.target.value,
                                        })
                                    }
                                    placeholder="0"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="estimated_price">
                                    Estimated Max Price (₹)
                                </Label>
                                <Input
                                    id="estimated_price"
                                    value={formData.estimated_price}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            estimated_price: e.target.value,
                                        })
                                    }
                                    placeholder="0"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="sort_order">Sort Order</Label>
                            <Input
                                id="sort_order"
                                value={formData.sort_order}
                                onChange={(e) =>
                                    setFormData({ ...formData, sort_order: e.target.value })
                                }
                                placeholder="0"
                                type="number"
                                min="0"
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <Label htmlFor="is_active">Active Status</Label>
                            <Switch
                                id="is_active"
                                checked={formData.is_active}
                                onCheckedChange={(checked) =>
                                    setFormData({ ...formData, is_active: checked })
                                }
                            />
                        </div>

                        {error && (
                            <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md">
                                {error}
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Update Issue
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
