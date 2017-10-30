Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/xenial64"
  config.ssh.forward_agent = true
  config.vm.network "private_network", ip: "192.168.50.4"
  config.vm.provision "ansible" do |ansible|
    ansible.playbook = "./provision.yml"
  end
end
