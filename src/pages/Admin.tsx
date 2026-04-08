import { useEffect, useState, useCallback } from "react";
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
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { LogOut, Eye, Image, Settings, Upload, Save, ShoppingCart } from "lucide-react";

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
  const [bannerSaving, setBannerSaving] = useState<string | null>(null);

  // Views state
  const [viewsToday, setViewsToday] = useState(0);
  const [viewsTotal, setViewsTotal] = useState(0);

  // Transactions state
  const [transactions, setTransactions] = useState<any[]>([]);
  const [txLoading, setTxLoading] = useState(true);

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

  const loadBanners = useCallback(async () => {
    if (!isAdmin) return;
    const { data, error } = await supabase
      .from("banners")
      .select("*")
      .order("position", { ascending: true });
    if (!error) setBanners(data || []);
    setBannersLoading(false);
  }, [isAdmin]);

  useEffect(() => { loadBanners(); }, [loadBanners]);

  // Load transactions
  useEffect(() => {
    if (!isAdmin) return;
    supabase
      .from("transactions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50)
      .then(({ data }) => {
        setTransactions(data || []);
        setTxLoading(false);
      });
  }, [isAdmin]);

  const approvedCount = transactions.filter(t => t.status === "approved").length;
  const approvedTotal = transactions
    .filter(t => t.status === "approved")
    .reduce((sum, t) => sum + (t.amount || 0), 0);

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
    if (error) toast.error("Erro ao salvar: " + error.message);
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
    if (uploadError) { toast.error("Erro no upload: " + uploadError.message); return; }
    const { data: { publicUrl } } = supabase.storage.from("site-assets").getPublicUrl(path);
    const url = publicUrl + "?t=" + Date.now();
    await supabase.from("site_settings").update({ profile_image_url: url }).eq("id", settings.id);
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
    if (uploadError) { toast.error("Erro no upload: " + uploadError.message); return; }
    const { data: { publicUrl } } = supabase.storage.from("site-assets").getPublicUrl(path);
    const url = publicUrl + "?t=" + Date.now();
    const { error } = await supabase.from("banners").update({ image_url: url }).eq("id", bannerId);
    if (error) { toast.error("Erro ao salvar banner: " + error.message); return; }
    setBanners(prev => prev.map(b => b.id === bannerId ? { ...b, image_url: url } : b));
    toast.success("Banner atualizado!");
    queryClient.invalidateQueries({ queryKey: ["banners"] });
  };

  const handleBannerFieldUpdate = async (bannerId: string, field: string, value: any) => {
    setBanners(prev => prev.map(b => b.id === bannerId ? { ...b, [field]: value } : b));
  };

  const handleSaveBanner = async (banner: any) => {
    setBannerSaving(banner.id);
    const { error } = await supabase
      .from("banners")
      .update({
        link_url: banner.link_url,
        link_type: banner.link_type,
        is_active: banner.is_active,
      })
      .eq("id", banner.id);
    if (error) toast.error("Erro ao salvar: " + error.message);
    else {
      toast.success("Banner salvo!");
      queryClient.invalidateQueries({ queryKey: ["banners"] });
    }
    setBannerSaving(null);
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
          <h1 className="text-xl font-bold blue-text">Painel Admin</h1>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-1" /> Sair
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <Eye className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
              <p className="text-2xl font-bold text-foreground">{viewsToday}</p>
              <p className="text-xs text-muted-foreground">Visitas Hoje</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Eye className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
              <p className="text-2xl font-bold text-foreground">{viewsTotal}</p>
              <p className="text-xs text-muted-foreground">Visitas Total</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <ShoppingCart className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
              <p className="text-2xl font-bold text-foreground">{approvedCount}</p>
              <p className="text-xs text-muted-foreground">Vendas</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <ShoppingCart className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
              <p className="text-2xl font-bold text-foreground">R$ {(approvedTotal / 100).toFixed(2).replace(".", ",")}</p>
              <p className="text-xs text-muted-foreground">Faturamento</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="profile">
          <TabsList className="w-full">
            <TabsTrigger value="profile" className="flex-1"><Settings className="w-4 h-4 mr-1" /> Perfil</TabsTrigger>
            <TabsTrigger value="banners" className="flex-1"><Image className="w-4 h-4 mr-1" /> Banners</TabsTrigger>
            <TabsTrigger value="vendas" className="flex-1"><ShoppingCart className="w-4 h-4 mr-1" /> Vendas</TabsTrigger>
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
                  <Label>WhatsApp (suporte)</Label>
                  <Input value={whatsappUrl} onChange={e => setWhatsappUrl(e.target.value)} placeholder="https://wa.me/5511999999999" />
                </div>
                <Button onClick={handleSaveProfile} disabled={saving} className="w-full">
                  {saving ? "Salvando..." : "Salvar Perfil"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="banners" className="mt-4 space-y-4">
            {banners.map((banner, i) => (
              <Card key={banner.id}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground">Banner {i + 1} — Posição {banner.position}</p>
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`active-${banner.id}`} className="text-xs text-muted-foreground">Ativo</Label>
                      <Switch
                        id={`active-${banner.id}`}
                        checked={banner.is_active}
                        onCheckedChange={(val) => handleBannerFieldUpdate(banner.id, "is_active", val)}
                      />
                    </div>
                  </div>

                  {banner.image_url && (
                    <img src={banner.image_url} alt={`Banner ${i + 1}`} className="w-full rounded-lg aspect-[16/10] object-cover border border-border" />
                  )}

                  <label className="cursor-pointer inline-block">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-secondary text-sm text-foreground hover:bg-muted transition-colors">
                      <Upload className="w-4 h-4" /> Trocar imagem
                    </div>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleBannerImageUpload(banner.id, e)} />
                  </label>

                  <div>
                    <Label className="text-xs">Tipo de link</Label>
                    <Select
                      value={banner.link_type}
                      onValueChange={(val) => handleBannerFieldUpdate(banner.id, "link_type", val)}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="page">Página interna</SelectItem>
                        <SelectItem value="external">Link externo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-xs">URL do link</Label>
                    <Input
                      value={banner.link_url}
                      onChange={(e) => handleBannerFieldUpdate(banner.id, "link_url", e.target.value)}
                      placeholder={banner.link_type === "external" ? "https://..." : "/comunidade"}
                    />
                  </div>

                  <Button
                    size="sm"
                    onClick={() => handleSaveBanner(banner)}
                    disabled={bannerSaving === banner.id}
                    className="w-full"
                  >
                    <Save className="w-4 h-4 mr-1" />
                    {bannerSaving === banner.id ? "Salvando..." : "Salvar Banner"}
                  </Button>
                </CardContent>
              </Card>
            ))}
            {banners.length === 0 && !bannersLoading && (
              <p className="text-sm text-muted-foreground text-center py-8">Nenhum banner cadastrado.</p>
            )}
          </TabsContent>

          <TabsContent value="vendas" className="mt-4 space-y-3">
            {transactions.length === 0 && !txLoading && (
              <p className="text-sm text-muted-foreground text-center py-8">Nenhuma transação ainda.</p>
            )}
            {transactions.map((tx) => (
              <Card key={tx.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-foreground">{tx.customer_name}</p>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      tx.status === "approved" ? "bg-green-500/20 text-green-400" :
                      tx.status === "pending" ? "bg-yellow-500/20 text-yellow-400" :
                      tx.status === "refunded" ? "bg-blue-500/20 text-blue-400" :
                      "bg-red-500/20 text-red-400"
                    }`}>
                      {tx.status === "approved" ? "Aprovado" :
                       tx.status === "pending" ? "Pendente" :
                       tx.status === "refunded" ? "Reembolsado" :
                       tx.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{tx.customer_email}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-sm font-bold text-foreground">R$ {(tx.amount / 100).toFixed(2).replace(".", ",")}</p>
                    <p className="text-xs text-muted-foreground">{new Date(tx.created_at).toLocaleString("pt-BR")}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
