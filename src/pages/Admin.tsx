import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAdmin } from "@/hooks/useAdmin";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { LogOut, Eye, Image, Settings, Upload } from "lucide-react";

const Admin = () => {
  const navigate = useNavigate();
  const { user, isAdmin, loading: adminLoading } = useAdmin();
  const { data: settings } = useSiteSettings();
  const queryClient = useQueryClient();

  // Profile form state
  const [profileName, setProfileName] = useState("");
  const [bio, setBio] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const [saving, setSaving] = useState(false);

  // Banners state
  const [banners, setBanners] = useState<any[]>([]);
  const [bannersLoading, setBannersLoading] = useState(true);

  // Views state
  const [viewsToday, setViewsToday] = useState(0);
  const [viewsTotal, setViewsTotal] = useState(0);

  useEffect(() => {
    if (!adminLoading && !isAdmin) navigate("/admin/login");
  }, [isAdmin, adminLoading, navigate]);

  useEffect(() => {
    if (settings) {
      setProfileName(settings.profile_name || "");
      setBio(settings.bio || "");
      setInstagramUrl(settings.instagram_url || "");
      setYoutubeUrl(settings.youtube_url || "");
      setWhatsappUrl(settings.whatsapp_url || "");
    }
  }, [settings]);

  // Load banners (all, not just active, for admin)
  useEffect(() => {
    if (!isAdmin) return;
    supabase
      .from("banners")
      .select("*")
      .order("position", { ascending: true })
      .then(({ data }) => {
        setBanners(data || []);
        setBannersLoading(false);
      });
  }, [isAdmin]);

  // Load views
  useEffect(() => {
    if (!isAdmin) return;
    const today = new Date().toISOString().split("T")[0];
    
    supabase
      .from("page_views")
      .select("id", { count: "exact", head: true })
      .then(({ count }) => setViewsTotal(count || 0));

    supabase
      .from("page_views")
      .select("id", { count: "exact", head: true })
      .gte("created_at", today)
      .then(({ count }) => setViewsToday(count || 0));
  }, [isAdmin]);

  const handleSaveProfile = async () => {
    if (!settings) return;
    setSaving(true);
    const { error } = await supabase
      .from("site_settings")
      .update({
        profile_name: profileName,
        bio,
        instagram_url: instagramUrl,
        youtube_url: youtubeUrl,
        whatsapp_url: whatsappUrl,
      })
      .eq("id", settings.id);
    if (error) toast.error("Erro ao salvar");
    else {
      toast.success("Configurações salvas!");
      queryClient.invalidateQueries({ queryKey: ["site_settings"] });
    }
    setSaving(false);
  };

  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !settings) return;
    const ext = file.name.split(".").pop();
    const path = `profile/avatar.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("site-assets")
      .upload(path, file, { upsert: true });
    if (uploadError) { toast.error("Erro no upload"); return; }
    const { data: { publicUrl } } = supabase.storage.from("site-assets").getPublicUrl(path);
    await supabase.from("site_settings").update({ profile_image_url: publicUrl }).eq("id", settings.id);
    toast.success("Foto atualizada!");
    queryClient.invalidateQueries({ queryKey: ["site_settings"] });
  };

  const handleBannerImageUpload = async (bannerId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split(".").pop();
    const path = `banners/${bannerId}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("site-assets")
      .upload(path, file, { upsert: true });
    if (uploadError) { toast.error("Erro no upload"); return; }
    const { data: { publicUrl } } = supabase.storage.from("site-assets").getPublicUrl(path);
    await supabase.from("banners").update({ image_url: publicUrl }).eq("id", bannerId);
    setBanners(prev => prev.map(b => b.id === bannerId ? { ...b, image_url: publicUrl } : b));
    toast.success("Banner atualizado!");
    queryClient.invalidateQueries({ queryKey: ["banners"] });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  if (adminLoading) return <div className="min-h-screen bg-background flex items-center justify-center text-foreground">Carregando...</div>;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold gold-text">Painel Admin</h1>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-1" /> Sair
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <Eye className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
              <p className="text-2xl font-bold text-foreground">{viewsToday}</p>
              <p className="text-xs text-muted-foreground">Hoje</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Eye className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
              <p className="text-2xl font-bold text-foreground">{viewsTotal}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="profile">
          <TabsList className="w-full">
            <TabsTrigger value="profile" className="flex-1"><Settings className="w-4 h-4 mr-1" /> Perfil</TabsTrigger>
            <TabsTrigger value="banners" className="flex-1"><Image className="w-4 h-4 mr-1" /> Banners</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-4 space-y-4">
            <Card>
              <CardHeader><CardTitle className="text-sm">Foto de Perfil</CardTitle></CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  {settings?.profile_image_url && (
                    <img src={settings.profile_image_url} alt="Perfil" className="w-16 h-16 rounded-full object-cover border-2 border-primary/40" />
                  )}
                  <label className="cursor-pointer">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-secondary text-sm text-foreground hover:bg-muted transition-colors">
                      <Upload className="w-4 h-4" /> Trocar foto
                    </div>
                    <input type="file" accept="image/*" className="hidden" onChange={handleProfileImageUpload} />
                  </label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-sm">Informações</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label>Nome</Label>
                  <Input value={profileName} onChange={e => setProfileName(e.target.value)} />
                </div>
                <div>
                  <Label>Bio</Label>
                  <Textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} />
                </div>
                <div>
                  <Label>Instagram URL</Label>
                  <Input value={instagramUrl} onChange={e => setInstagramUrl(e.target.value)} placeholder="https://instagram.com/..." />
                </div>
                <div>
                  <Label>YouTube URL</Label>
                  <Input value={youtubeUrl} onChange={e => setYoutubeUrl(e.target.value)} placeholder="https://youtube.com/..." />
                </div>
                <div>
                  <Label>WhatsApp URL</Label>
                  <Input value={whatsappUrl} onChange={e => setWhatsappUrl(e.target.value)} placeholder="https://wa.me/5511..." />
                </div>
                <Button onClick={handleSaveProfile} disabled={saving} className="w-full">
                  {saving ? "Salvando..." : "Salvar"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="banners" className="mt-4 space-y-4">
            {banners.map((banner, i) => (
              <Card key={banner.id}>
                <CardContent className="p-4">
                  <p className="text-sm font-medium text-foreground mb-2">Banner {i + 1} — Posição {banner.position}</p>
                  {banner.image_url && (
                    <img src={banner.image_url} alt={`Banner ${i + 1}`} className="w-full rounded-lg mb-3 aspect-[16/10] object-cover border border-border" />
                  )}
                  <label className="cursor-pointer inline-block">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-secondary text-sm text-foreground hover:bg-muted transition-colors">
                      <Upload className="w-4 h-4" /> Trocar imagem
                    </div>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleBannerImageUpload(banner.id, e)} />
                  </label>
                  <p className="text-xs text-muted-foreground mt-2">Link: {banner.link_url}</p>
                </CardContent>
              </Card>
            ))}
            {banners.length === 0 && !bannersLoading && (
              <p className="text-sm text-muted-foreground text-center py-8">Nenhum banner cadastrado.</p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
