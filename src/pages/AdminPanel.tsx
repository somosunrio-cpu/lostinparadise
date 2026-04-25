import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getRoutes, saveRoutes, BikeRoute, RoutePoint } from "@/lib/routes-data";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Plus, Trash2, Save, Eye } from "lucide-react";
import LangToggle from "@/components/LangToggle";
import RouteEditorMap from "@/components/RouteEditorMap";

const emptyRoute: Omit<BikeRoute, "id"> = {
  code: "",
  name: "",
  description: "",
  distance: "",
  duration: "",
  difficulty: "Fácil",
  points: [{ lat: 38.7080, lng: 1.4220, instruction: "" }],
};

const AdminPanel = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [routes, setRoutes] = useState<BikeRoute[]>([]);
  const [editing, setEditing] = useState<BikeRoute | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => { setRoutes(getRoutes()); }, []);

  const handleSaveAll = () => {
    saveRoutes(routes);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleAddRoute = () => {
    const newRoute: BikeRoute = { ...emptyRoute, id: Date.now().toString(), points: [{ lat: 38.7080, lng: 1.4220, instruction: "" }] };
    setEditing(newRoute);
  };

  const handleSaveEdit = () => {
    if (!editing) return;
    const exists = routes.find((r) => r.id === editing.id);
    const updated = exists ? routes.map((r) => (r.id === editing.id ? editing : r)) : [...routes, editing];
    setRoutes(updated);
    saveRoutes(updated);
    setEditing(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDelete = (id: string) => {
    const updated = routes.filter((r) => r.id !== id);
    setRoutes(updated);
    saveRoutes(updated);
  };

  const addPoint = () => {
    if (!editing) return;
    setEditing({ ...editing, points: [...editing.points, { lat: 38.7, lng: 1.42, instruction: "" }] });
  };

  const updatePoint = (idx: number, field: keyof RoutePoint, value: string) => {
    if (!editing) return;
    const points = [...editing.points];
    if (field === "lat" || field === "lng") {
      (points[idx] as any)[field] = parseFloat(value) || 0;
    } else {
      (points[idx] as any)[field] = value;
    }
    setEditing({ ...editing, points });
  };

  const removePoint = (idx: number) => {
    if (!editing) return;
    setEditing({ ...editing, points: editing.points.filter((_, i) => i !== idx) });
  };

  if (editing) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" size="sm" onClick={() => setEditing(null)} className="text-muted-foreground">
              <ArrowLeft className="w-4 h-4 mr-1" /> {t("backToList")}
            </Button>
            <LangToggle className="bg-muted/50 text-foreground border-border" />
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-6">
            {editing.name || t("newRoute")}
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">{t("code")}</label>
                <Input value={editing.code} onChange={(e) => setEditing({ ...editing, code: e.target.value.toUpperCase() })} placeholder="RUTA01" />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">{t("name")}</label>
                <Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">{t("description")}</label>
              <Input value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">{t("distance")}</label>
                <Input value={editing.distance} onChange={(e) => setEditing({ ...editing, distance: e.target.value })} placeholder="15 km" />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">{t("duration")}</label>
                <Input value={editing.duration} onChange={(e) => setEditing({ ...editing, duration: e.target.value })} placeholder="1h 30min" />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">{t("difficulty")}</label>
                <select
                  value={editing.difficulty}
                  onChange={(e) => setEditing({ ...editing, difficulty: e.target.value as BikeRoute["difficulty"] })}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="Fácil">{t("easy")}</option>
                  <option value="Media">{t("medium")}</option>
                  <option value="Difícil">{t("hard")}</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">{t("routePoints")}</label>
              <RouteEditorMap
                points={editing.points}
                onChange={(points) => setEditing({ ...editing, points })}
              />
            </div>

            <Button onClick={handleSaveEdit} className="w-full">
              <Save className="w-4 h-4 mr-2" /> {t("saveRoute")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="text-muted-foreground">
            <ArrowLeft className="w-4 h-4 mr-1" /> {t("exit")}
          </Button>
          <LangToggle className="bg-muted/50 text-foreground border-border" />
        </div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-3xl font-bold text-foreground">{t("adminPanel")}</h1>
          <Button onClick={handleAddRoute} className="gap-1">
            <Plus className="w-4 h-4" /> {t("newRoute")}
          </Button>
        </div>

        {saved && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-olive/10 border border-olive/30 text-olive rounded-lg p-3 mb-4 text-sm text-center">
            {t("savedOk")}
          </motion.div>
        )}

        <div className="space-y-3">
          {routes.map((route) => (
            <motion.div
              key={route.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-card border rounded-xl p-4 flex items-center justify-between"
            >
              <div>
                <h3 className="font-display font-semibold text-foreground">{route.name}</h3>
                <p className="text-xs text-muted-foreground">{t("code")}: <span className="font-mono tracking-wider">{route.code}</span> · {route.distance} · {route.difficulty}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => navigate(`/route/${route.id}`)}><Eye className="w-4 h-4" /></Button>
                <Button variant="outline" size="sm" onClick={() => setEditing({ ...route })}> {t("edit")}</Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(route.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
