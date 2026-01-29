"use client";

import { useState } from "react";
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
import { addCategory } from "@/app/categories/actions";

interface AddCategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function AddCategoryModal({ isOpen, onClose, onSuccess }: AddCategoryModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        description: "",
        icon_url: "",
        is_active: true,
        base_inspection_fee: "",
        sort_order: "",
    });

    const handleNameChange = (name: string) => {
        const slug = name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
        setFormData({ ...formData, name, slug });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const categoryData = {
                name: formData.name,
                slug: formData.slug,
                description: formData.description || undefined,
                icon_url: formData.icon_url || undefined,
                is_active: formData.is_active,
                base_inspection_fee: formData.base_inspection_fee
                    ? parseFloat(formData.base_inspection_fee)
                    : undefined,
                sort_order: formData.sort_order
                    ? parseInt(formData.sort_order)
                    : undefined,
            };

            await addCategory(categoryData);

            // Reset form
            setFormData({
                name: "",
                slug: "",
                description: "",
                icon_url: "",
                is_active: true,
                base_inspection_fee: "",
                sort_order: "",
            });

            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.message || "Failed to add category");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Add New Category</DialogTitle>
                    <DialogDescription>
                        Create a new service category with base inspection fee.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">
                                Category Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleNameChange(e.target.value)}
                                placeholder="e.g., Washing Machine"
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="slug">Slug (auto-generated)</Label>
                            <Input
                                id="slug"
                                value={formData.slug}
                                onChange={(e) =>
                                    setFormData({ ...formData, slug: e.target.value })
                                }
                                placeholder="washing-machine"
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
                                placeholder="Brief description of the service category"
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
                                <Label htmlFor="base_inspection_fee">
                                    Base Inspection Fee (₹)
                                </Label>
                                <Input
                                    id="base_inspection_fee"
                                    value={formData.base_inspection_fee}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            base_inspection_fee: e.target.value,
                                        })
                                    }
                                    placeholder="0"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                />
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
                            Add Category
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
