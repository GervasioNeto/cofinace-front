import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { api } from '@/services/api';
import { toast } from 'sonner';
import { Plus, Users, Wallet } from 'lucide-react';
import { GroupDTO } from '@/types';

const Groups = () => {
  const navigate = useNavigate();
  const { currentUser, groups, setGroups } = useStore();
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [creating, setCreating] = useState(false);
  
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    loadGroups();
    loadGroupsWithTransactions();
  }, [currentUser, navigate]);
  
  const loadGroups = async () => {
    try {
      const data = await api.groups.getAll();
      setGroups(data);
    } catch (error) {
      toast.error('Erro ao carregar grupos');
    } finally {
      setLoading(false);
    }
  };

const loadGroupsWithTransactions = async () => {
  try {
    const groupsData = await api.groups.getAll();

    const groupsWithTx = await Promise.all(
      groupsData.map(async (g) => {
        const tx = await api.groups.getGroupTransactions(g.id);
        return { ...g, transactions: tx }; 
      })
    );

    setGroups(groupsWithTx);
  } catch (error) {
    toast.error('Erro ao carregar grupos');
  } finally {
    setLoading(false);
  }
};
  
  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {

      await api.groups.create({
        name: newGroupName,
        description: newGroupDescription
      }, String(currentUser.id));
      
      toast.success('Grupo criado com sucesso!');
      setIsDialogOpen(false);
      setNewGroupName('');
      setNewGroupDescription('');
      loadGroups();
      loadGroupsWithTransactions();
    } catch (error) {
      toast.error('Erro ao criar grupo');
    } finally {
      setCreating(false);
    }
  };
  
  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Grupos</h2>
            <p className="text-muted-foreground">
              Gerencie seus grupos de despesas
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Novo Grupo
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Novo Grupo</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateGroup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Grupo</Label>
                  <Input
                    id="name"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    placeholder="Ex: Viagem à Praia"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição (opcional)</Label>
                  <Textarea
                    id="description"
                    value={newGroupDescription}
                    onChange={(e) => setNewGroupDescription(e.target.value)}
                    placeholder="Descreva o objetivo do grupo..."
                    rows={3}
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={creating}>
                  {creating ? 'Criando...' : 'Criar Grupo'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <Card 
              key={group.id} 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/groups/${group.id}`)}
            >
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-gradient-accent rounded-xl flex items-center justify-center flex-shrink-0">
                    <Wallet className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">{group.name}</CardTitle>
                    {group.description && (
                      <CardDescription className="line-clamp-2 mt-1">
                        {group.description}
                      </CardDescription>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{group.users?.length || 0} membros</span>
                  <span className="mx-1">•</span>
                  <span>{group.transactions?.length || 0} transações</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {groups.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Wallet className="w-16 h-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-center">
                Nenhum grupo cadastrado ainda.
                <br />
                Crie o primeiro grupo para começar a controlar suas despesas!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Groups;
