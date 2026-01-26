import { useState } from 'react';
import { Plus, Check, Clock, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { cn, getPriorityColor, formatDate } from '../lib/utils';

// Mock data
const mockTasks = [
  { id: '1', titre: 'Rappeler M. Dupont', description: 'Relance pour essai 3008', type: 'appel', priorite: 'haute', statut: 'a_faire', date_echeance: '2024-06-10T14:00:00Z' },
  { id: '2', titre: 'Envoyer devis Clio', description: 'Devis avec financement LOA', type: 'email', priorite: 'normale', statut: 'a_faire', date_echeance: '2024-06-10T17:00:00Z' },
  { id: '3', titre: 'RDV 14h Mme Martin', description: 'Essai BMW 320d', type: 'rendez_vous', priorite: 'haute', statut: 'a_faire', date_echeance: '2024-06-10T14:00:00Z' },
  { id: '4', titre: 'CT véhicule AB-123-CD', description: 'Passage au contrôle technique', type: 'administratif', priorite: 'urgente', statut: 'a_faire', date_echeance: '2024-06-11T09:00:00Z' },
  { id: '5', titre: 'Relance prospect Petit', description: 'Sans nouvelles depuis 5 jours', type: 'relance', priorite: 'normale', statut: 'en_cours', date_echeance: '2024-06-09T10:00:00Z' },
  { id: '6', titre: 'Finaliser dossier financement', description: 'Client Durand - Golf R-Line', type: 'administratif', priorite: 'haute', statut: 'terminee', date_echeance: '2024-06-08T16:00:00Z' },
];

type TaskFilter = 'all' | 'today' | 'overdue' | 'completed';

export function TasksPage() {
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [tasks, setTasks] = useState(mockTasks);

  const handleComplete = (taskId: string) => {
    setTasks(tasks.map(t =>
      t.id === taskId ? { ...t, statut: 'terminee' } : t
    ));
  };

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

  const filteredTasks = tasks.filter(task => {
    switch (filter) {
      case 'today':
        if (!task.date_echeance) return false;
        const date = new Date(task.date_echeance);
        return date >= todayStart && date < todayEnd && task.statut !== 'terminee';
      case 'overdue':
        if (!task.date_echeance) return false;
        return new Date(task.date_echeance) < now && task.statut !== 'terminee';
      case 'completed':
        return task.statut === 'terminee';
      default:
        return true;
    }
  });

  const counts = {
    all: tasks.length,
    today: tasks.filter(t => {
      if (!t.date_echeance) return false;
      const date = new Date(t.date_echeance);
      return date >= todayStart && date < todayEnd && t.statut !== 'terminee';
    }).length,
    overdue: tasks.filter(t => {
      if (!t.date_echeance) return false;
      return new Date(t.date_echeance) < now && t.statut !== 'terminee';
    }).length,
    completed: tasks.filter(t => t.statut === 'terminee').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Tâches</h1>
          <p className="text-muted-foreground">
            Gérez vos tâches et rappels
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle tâche
        </Button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {[
          { value: 'all', label: 'Toutes', count: counts.all },
          { value: 'today', label: "Aujourd'hui", count: counts.today, icon: Clock },
          { value: 'overdue', label: 'En retard', count: counts.overdue, icon: AlertCircle, danger: true },
          { value: 'completed', label: 'Terminées', count: counts.completed, icon: Check },
        ].map((tab) => (
          <Button
            key={tab.value}
            variant={filter === tab.value ? 'default' : 'outline'}
            onClick={() => setFilter(tab.value as TaskFilter)}
            className={cn(
              tab.danger && filter !== tab.value && counts.overdue > 0 && 'border-red-300 text-red-600'
            )}
          >
            {tab.icon && <tab.icon className="h-4 w-4 mr-2" />}
            {tab.label}
            <Badge
              variant={filter === tab.value ? 'secondary' : 'outline'}
              className="ml-2"
            >
              {tab.count}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Tasks list */}
      <div className="space-y-3">
        {filteredTasks.map((task) => {
          const isOverdue = task.date_echeance && new Date(task.date_echeance) < now && task.statut !== 'terminee';

          return (
            <Card
              key={task.id}
              className={cn(
                'transition-all',
                task.statut === 'terminee' && 'opacity-60',
                isOverdue && 'border-red-200'
              )}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Checkbox */}
                  <button
                    onClick={() => handleComplete(task.id)}
                    className={cn(
                      'mt-0.5 h-5 w-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors',
                      task.statut === 'terminee'
                        ? 'bg-green-500 border-green-500'
                        : 'border-muted-foreground hover:border-primary'
                    )}
                  >
                    {task.statut === 'terminee' && (
                      <Check className="h-3 w-3 text-white" />
                    )}
                  </button>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3
                        className={cn(
                          'font-medium',
                          task.statut === 'terminee' && 'line-through text-muted-foreground'
                        )}
                      >
                        {task.titre}
                      </h3>
                      <Badge className={getPriorityColor(task.priorite)}>
                        {task.priorite}
                      </Badge>
                      <Badge variant="outline">{task.type}</Badge>
                    </div>

                    {task.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {task.description}
                      </p>
                    )}

                    {task.date_echeance && (
                      <p
                        className={cn(
                          'text-xs mt-2',
                          isOverdue ? 'text-red-500' : 'text-muted-foreground'
                        )}
                      >
                        {isOverdue && <AlertCircle className="h-3 w-3 inline mr-1" />}
                        Échéance: {formatDate(task.date_echeance)}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {filteredTasks.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">Aucune tâche</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
